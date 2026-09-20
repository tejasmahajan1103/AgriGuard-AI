import base64
import datetime
import json
import os
import re
import urllib.parse
import urllib.request
import uuid
import boto3

dynamodb = boto3.resource("dynamodb", region_name="eu-north-1")
table = dynamodb.Table("AgriGuardData")

sns = boto3.client("sns", region_name="eu-north-1")
TOPIC_ARN = "arn:aws:sns:eu-north-1:320698388774:AgriGuardAlerts"

s3_client = boto3.client("s3", region_name="eu-north-1")
BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "agriguard-ai-320698388774")

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB


def get_weather():
    api_key = os.environ["OPENWEATHER_API_KEY"]

    lat = 18.5204
    lon = 73.8567

    params = urllib.parse.urlencode({
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric"
    })

    url = f"https://api.openweathermap.org/data/2.5/weather?{params}"

    with urllib.request.urlopen(url, timeout=10) as response:
        weather = json.loads(response.read().decode("utf-8"))

    return {
        "location": weather["name"],
        "temperature": weather["main"]["temp"],
        "feels_like": weather["main"]["feels_like"],
        "humidity": weather["main"]["humidity"],
        "weather": weather["weather"][0]["description"],
        "wind_speed": weather["wind"]["speed"]
    }


def analyze_crop_image_with_gemini(image_bytes, content_type, api_key):
    """
    Calls Google Gemini AI Vision API with crop image bytes and returns structured JSON analysis.
    Transmits the API key securely via the 'x-goog-api-key' request header.
    """
    model = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
    model_path = model if model.startswith("models/") else f"models/{model}"
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_path}:generateContent"

    prompt = (
        "You are an expert agricultural plant pathologist and agronomist. "
        "Analyze this crop image to assess plant health, identify visible symptoms, "
        "and determine any possible crop diseases or nutrient/pest issues.\n\n"
        "Guidelines:\n"
        "1. Identify the crop accurately (or 'Unknown' if unidentifiable).\n"
        "2. If symptoms of a disease, pest, or nutrient deficiency are visible, identify the most likely condition.\n"
        "3. Do NOT invent a disease. If the crop appears healthy, set possible_disease to 'Healthy'. "
        "If evidence or image quality is insufficient, set possible_disease to 'Insufficient evidence'.\n"
        "4. Do NOT claim certainty. Provide a realistic confidence_percent (integer 0-100) reflecting visible evidence.\n"
        "5. Severity must be one of: 'Healthy', 'Low', 'Moderate', 'High', or 'Severe'.\n"
        "6. List clear visible symptoms and practical actionable recommendations.\n"
        "7. Note: This is an AI-assisted agricultural assessment, not a definitive laboratory diagnosis.\n\n"
        "Return ONLY a valid JSON object with this exact structure:\n"
        "{\n"
        '  "crop": "<crop name or Unknown>",\n'
        '  "possible_disease": "<disease name, Healthy, or Insufficient evidence>",\n'
        '  "confidence_percent": <integer 0-100>,\n'
        '  "severity": "<Healthy | Low | Moderate | High | Severe>",\n'
        '  "visible_symptoms": ["<symptom 1>", "<symptom 2>"],\n'
        '  "recommendations": ["<recommendation 1>", "<recommendation 2>"]\n'
        "}"
    )

    base64_data = base64.b64encode(image_bytes).decode("utf-8")

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": content_type,
                            "data": base64_data
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "response_mime_type": "application/json"
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=25) as response:
        resp_data = json.loads(response.read().decode("utf-8"))

    # Extract text content from Gemini candidates
    candidates = resp_data.get("candidates", [])
    if not candidates:
        raise ValueError("No candidates returned from Gemini API")

    content_parts = candidates[0].get("content", {}).get("parts", [])
    if not content_parts:
        raise ValueError("Empty response parts from Gemini API")

    raw_text = content_parts[0].get("text", "").strip()

    # Strip markdown code blocks if present
    if raw_text.startswith("```"):
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)
    raw_text = raw_text.strip()

    parsed = json.loads(raw_text)

    # Normalize fields
    crop = str(parsed.get("crop", "Unknown")).strip() or "Unknown"
    possible_disease = str(parsed.get("possible_disease", "Insufficient evidence")).strip() or "Insufficient evidence"

    try:
        confidence = int(parsed.get("confidence_percent", 0))
        confidence = max(0, min(100, confidence))
    except (ValueError, TypeError):
        confidence = 0

    severity = str(parsed.get("severity", "Moderate")).strip()
    valid_severities = {"Healthy", "Low", "Moderate", "High", "Severe"}
    if severity not in valid_severities:
        severity = "Moderate"

    symptoms = parsed.get("visible_symptoms", [])
    if not isinstance(symptoms, list):
        symptoms = [str(symptoms)] if symptoms else []
    visible_symptoms = [str(s).strip() for s in symptoms if str(s).strip()]

    recs = parsed.get("recommendations", [])
    if not isinstance(recs, list):
        recs = [str(recs)] if recs else []
    recommendations = [str(r).strip() for r in recs if str(r).strip()]

    return {
        "crop": crop,
        "possible_disease": possible_disease,
        "confidence_percent": confidence,
        "severity": severity,
        "visible_symptoms": visible_symptoms,
        "recommendations": recommendations
    }


def lambda_handler(event, context):

    route_key = event.get("routeKey", "")

    # Existing weather route - DO NOT BREAK
    if route_key == "GET /weather":

        weather = get_weather()

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "OpenWeather connection successful!",
                **weather
            })
        }

    # Existing API route - DO NOT BREAK
    if route_key == "POST /api":

        body = event.get("body")

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                body = {}

        body = body or {}

        user_id = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("jwt", {})
            .get("claims", {})
            .get("sub", "UNKNOWN")
        )

        item = {
            "userId": user_id,
            "Item_Id": "API#TEST",
            "itemType": "API_REQUEST",
            "data": body
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "AgriGuard API is working!",
                "userId": user_id,
                "data": body
            })
        }

    # Existing upload-url route for secure S3 image uploads - DO NOT BREAK
    if route_key == "POST /upload-url":

        user_id = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("jwt", {})
            .get("claims", {})
            .get("sub")
        )

        if not user_id:
            return {
                "statusCode": 401,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Unauthorized: Missing user identity"
                })
            }

        body = event.get("body")

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": json.dumps({
                        "message": "Invalid JSON in request body"
                    })
                }

        body = body or {}

        file_name = body.get("fileName", "").strip()
        content_type = body.get("contentType", "").strip().lower()

        if not file_name:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "fileName is required"
                })
            }

        if not content_type:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "contentType is required"
                })
            }

        if content_type not in ALLOWED_CONTENT_TYPES:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": f"Unsupported contentType: '{content_type}'. Allowed types: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
                })
            }

        # Sanitize filename to prevent path traversal
        base_name = os.path.basename(file_name)
        safe_file_name = re.sub(r"[^a-zA-Z0-9._-]", "_", base_name)
        if not safe_file_name:
            safe_file_name = "upload.jpg"

        unique_id = str(uuid.uuid4())
        s3_key = f"users/{user_id}/crop-images/{unique_id}-{safe_file_name}"

        try:
            presigned_url = s3_client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": BUCKET_NAME,
                    "Key": s3_key,
                    "ContentType": content_type
                },
                ExpiresIn=300
            )

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "uploadUrl": presigned_url,
                    "key": s3_key,
                    "expiresIn": 300
                })
            }
        except Exception as e:
            print(f"Error generating presigned S3 URL: {str(e)}")
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Failed to generate upload URL"
                })
            }

    # New analyze-crop route for real Gemini AI crop disease diagnosis
    if route_key == "POST /analyze-crop":

        user_id = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("jwt", {})
            .get("claims", {})
            .get("sub")
        )

        if not user_id:
            return {
                "statusCode": 401,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Unauthorized: Missing user identity"
                })
            }

        body = event.get("body")

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": json.dumps({
                        "message": "Invalid JSON in request body"
                    })
                }

        body = body or {}
        s3_key = body.get("s3Key", "").strip()

        if not s3_key:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "s3Key is required"
                })
            }

        # Security check: User can only access their own crop images
        expected_prefix = f"users/{user_id}/crop-images/"
        if not s3_key.startswith(expected_prefix):
            return {
                "statusCode": 403,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Forbidden: Access denied to the requested S3 key"
                })
            }

        # Fetch image from S3
        try:
            s3_response = s3_client.get_object(Bucket=BUCKET_NAME, Key=s3_key)
        except s3_client.exceptions.NoSuchKey:
            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Image not found in storage"
                })
            }
        except Exception as e:
            print(f"Error fetching image from S3: {str(e)}")
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Failed to retrieve image from storage"
                })
            }

        content_length = s3_response.get("ContentLength", 0)
        if content_length > MAX_IMAGE_SIZE_BYTES:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": "Image exceeds maximum allowed size (10MB)"
                })
            }

        content_type = s3_response.get("ContentType", "").strip().lower()
        if not content_type or content_type == "application/octet-stream":
            ext = os.path.splitext(s3_key)[1].lower()
            ext_map = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp"
            }
            content_type = ext_map.get(ext, "")

        if content_type not in ALLOWED_CONTENT_TYPES:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "message": f"Unsupported image content type: '{content_type}'. Allowed types: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
                })
            }

        image_bytes = s3_response["Body"].read()

        # Check Gemini API Key
        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_api_key:
            print("Error: GEMINI_API_KEY environment variable is not configured")
            return {
                "statusCode": 503,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "status": "AI_UNAVAILABLE",
                    "message": "AI crop analysis is temporarily unavailable. Please try again later."
                })
            }

        # Analyze with Gemini Vision
        try:
            analysis = analyze_crop_image_with_gemini(image_bytes, content_type, gemini_api_key)
        except Exception as e:
            print(f"Error during Gemini AI analysis: {str(e)}")
            return {
                "statusCode": 503,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "status": "AI_UNAVAILABLE",
                    "message": "AI crop analysis is temporarily unavailable. Please try again later."
                })
            }

        analyzed_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        analysis_id = str(uuid.uuid4())

        # Store genuine AI analysis in DynamoDB
        db_item = {
            "userId": user_id,
            "Item_Id": f"ANALYSIS#{analysis_id}",
            "itemType": "CROP_ANALYSIS",
            "s3Key": s3_key,
            "crop": analysis["crop"],
            "possibleDisease": analysis["possible_disease"],
            "confidencePercent": analysis["confidence_percent"],
            "severity": analysis["severity"],
            "visibleSymptoms": analysis["visible_symptoms"],
            "recommendations": analysis["recommendations"],
            "analyzedAt": analyzed_at
        }

        try:
            table.put_item(Item=db_item)
        except Exception as e:
            print(f"Error saving analysis to DynamoDB: {str(e)}")

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "status": "ANALYZED",
                "crop": analysis["crop"],
                "possibleDisease": analysis["possible_disease"],
                "confidencePercent": analysis["confidence_percent"],
                "severity": analysis["severity"],
                "visibleSymptoms": analysis["visible_symptoms"],
                "recommendations": analysis["recommendations"],
                "s3Key": s3_key,
                "analyzedAt": analyzed_at
            })
        }

    return {
        "statusCode": 404,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": "Route not found"
        })
    }
