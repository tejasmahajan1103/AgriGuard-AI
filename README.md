# 🌾 AgriGuard AI

**AgriGuard AI** is an AI-powered agriculture assistant designed to help farmers monitor crop health, analyze crop images, access live weather information, store farm-related data securely, and receive agriculture-related assistance through a modern web application.

The project combines a React/Vite frontend with AWS cloud services and Google Gemini 3.5 Flash for AI-powered crop analysis.

## 📌 Problem Statement

Farmers often need to make decisions based on crop health, weather conditions, and visible plant symptoms. Identifying crop problems at an early stage can be difficult when expert agricultural support is not immediately available.

AgriGuard AI provides a centralized digital platform where users can:

- Upload crop images for AI-assisted analysis.
- View crop health information.
- Access live weather information.
- Store farm and crop-related data.
- Receive alerts through AWS notification services.
- Use authentication to keep user data separated and protected.

The system is designed as an AI-assisted decision-support platform. AI results are intended to support observation and decision-making and should not be treated as a laboratory diagnosis.

## 💡 Solution

AgriGuard AI provides a web-based agriculture assistant with the following major capabilities:

### 🌱 Crop Health Analysis

Users can upload crop images. The image is securely uploaded to Amazon S3 using a presigned URL. The backend retrieves the private image and sends it to Google Gemini 3.5 Flash for analysis.

The AI returns structured information such as:

- Crop identification
- Possible disease or condition
- Confidence percentage
- Severity
- Visible symptoms
- Recommendations

The analysis is stored in Amazon DynamoDB for future reference.

### 🌦️ Live Weather

The application connects to OpenWeather through an AWS Lambda backend to retrieve live weather information.

### 🔐 Authentication

Amazon Cognito provides user registration, email verification, login, logout, password recovery, and authenticated access.

### 🔔 Alerts

Amazon SNS is used for notification delivery. Amazon EventBridge Scheduler can trigger scheduled backend processing.

### ☁️ Cloud Backend

AWS Lambda, API Gateway, DynamoDB, S3, SNS, EventBridge, IAM, and CloudWatch provide the cloud infrastructure required by the application.

## 🏗️ System Architecture

```text
                         🌾 AgriGuard AI
                                │
                         React / Vite UI
                                │
                         AWS Amplify
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
            Amazon Cognito               API Gateway
          Authentication                    │
                                           ↓
                                        Lambda
                                           │
                 ┌─────────────┬───────────┼──────────────┐
                 │             │           │              │
                 ↓             ↓           ↓              ↓
             DynamoDB         S3       OpenWeather      Gemini
             Farm Data    Crop Images       API       3.5 Flash
                 │             │                         │
                 │             └──────────────┐          │
                 │                            ↓          │
                 │                       AI Analysis     │
                 │                            │          │
                 └────────────────────────────┴──────────┘
                                │
                         Amazon SNS
                                │
                         Email Alerts

                     EventBridge Scheduler
                              │
                              ↓
                           Lambda

                     CloudWatch Monitoring
```

## 🔄 How AgriGuard AI Works

### 1. User Authentication

1. The user opens AgriGuard AI.
2. The user registers or logs in.
3. Amazon Cognito authenticates the user.
4. Cognito provides identity tokens.
5. Authenticated API requests include the Cognito token.

### 2. Crop Image Upload

1. The user opens **Scan Crop**.
2. The frontend validates the image type and size.
3. The frontend requests an upload URL from API Gateway.
4. API Gateway authenticates the request.
5. AWS Lambda generates a short-lived S3 presigned URL.
6. The browser uploads the image directly to the private S3 bucket.
7. The generated S3 object key is retained for the analysis request.

Supported image formats:

- JPEG
- PNG
- WebP

The upload flow avoids exposing AWS credentials to the frontend.

### 3. AI Crop Analysis

```text
Crop Image
    ↓
Private Amazon S3
    ↓
AWS Lambda
    ↓
Google Gemini 3.5 Flash
    ↓
Structured JSON Analysis
    ↓
Amazon DynamoDB
    ↓
Frontend Result
```

The backend:

1. Receives the S3 object key.
2. Verifies that the authenticated user owns the requested S3 path.
3. Retrieves the private image from S3.
4. Sends the image to Gemini 3.5 Flash.
5. Requests structured JSON output.
6. Normalizes the returned analysis.
7. Stores the analysis in DynamoDB.
8. Returns the result to the frontend.

The AI prompt instructs the model not to invent a disease and to use **"Insufficient evidence"** when the image does not provide enough evidence for reliable disease identification.

## 🤖 AI Used

### Google Gemini 3.5 Flash

AgriGuard AI currently uses **Google Gemini 3.5 Flash** for multimodal crop-image analysis.

The model receives:

- Crop image
- Agriculture-focused analysis instructions

It produces structured information including:

```text
Crop
Possible Disease / Condition
Confidence
Severity
Visible Symptoms
Recommendations
```

AI output is treated as AI-assisted observation and not as a laboratory-confirmed diagnosis.

## ☁️ AWS Services Used

| AWS Service | Purpose |
|---|---|
| **Amazon Cognito** | User registration, authentication, email verification, login, logout and password recovery |
| **AWS Amplify** | Frontend hosting and production deployment |
| **Amazon API Gateway** | Secure HTTP API endpoints between frontend and backend |
| **AWS Lambda** | Serverless backend logic |
| **Amazon DynamoDB** | Stores user-related application data and crop analysis records |
| **Amazon S3** | Private storage for uploaded crop images |
| **Amazon SNS** | Email notification and alert delivery |
| **Amazon EventBridge Scheduler** | Scheduled backend processing |
| **AWS IAM** | Permissions and access control between AWS services |
| **Amazon CloudWatch** | Lambda/API monitoring, logs, alarms and dashboard |
| **Amazon Bedrock** | Planned AWS-native AI integration; not currently active |

## 🌐 External Services

### OpenWeather

OpenWeather is used for live weather information.

The frontend does not directly expose the OpenWeather API key. Weather requests are routed through the AWS Lambda backend.

### Google Gemini API

Google Gemini 3.5 Flash is currently used for crop-image AI analysis.

The Gemini API key is stored server-side in the Lambda environment and is not exposed to the frontend.

## 🔐 Security

AgriGuard AI implements several security controls:

### Amazon Cognito Authentication

Authenticated API routes use Cognito JWT authorization.

### User-Specific S3 Paths

Crop images use a user-specific path:

```text
users/{userId}/crop-images/{image}
```

The `/analyze-crop` backend verifies that the requested S3 key belongs to the authenticated user's ID.

### Private S3 Bucket

The crop-image bucket is private and uses:

- Block Public Access
- Bucket owner enforced
- Server-side encryption with S3-managed keys

### Presigned Upload URLs

The browser uploads images using short-lived presigned URLs instead of receiving AWS credentials.

### Server-Side API Keys

The OpenWeather and Gemini API keys are kept in backend environment variables rather than frontend source code.

### IAM Permissions

The Lambda execution role uses permissions for:

- DynamoDB
- S3
- SNS
- CloudWatch logging

### Monitoring

CloudWatch provides Lambda logs, error monitoring, duration monitoring, API Gateway 5xx monitoring, API latency monitoring, SNS metrics, and DynamoDB usage metrics.

## 📊 Database

### Amazon DynamoDB

Table:

```text
AgriGuardData
```

The backend stores application and analysis records using user-specific identifiers.

Crop analysis records use:

```text
itemType = CROP_ANALYSIS
```

and include information such as:

- User ID
- S3 object key
- Crop
- Possible disease/condition
- Confidence
- Severity
- Visible symptoms
- Recommendations
- Analysis timestamp

## 🪣 Image Storage

### Amazon S3

Bucket:

```text
agriguard-ai-320698388774
```

Crop images are stored using:

```text
users/{userId}/crop-images/{uuid}-{filename}
```

## 🌦️ Weather Architecture

```text
React Weather Page
        ↓
API Gateway
        ↓
Cognito JWT
        ↓
AWS Lambda
        ↓
OpenWeather API
        ↓
Weather Data
        ↓
React Weather Page
```

## 🔔 Notification Architecture

```text
EventBridge Scheduler
        ↓
AWS Lambda
        ↓
Amazon SNS
        ↓
Email Notification
```

Amazon SNS topic:

```text
AgriGuardAlerts
```

## 📈 Monitoring

Amazon CloudWatch is used to monitor the backend.

Configured monitoring includes:

- Lambda invocations
- Lambda errors
- Lambda duration
- API Gateway 5xx errors
- API Gateway latency
- DynamoDB consumed write capacity
- SNS published messages

Dashboard:

```text
AgriGuard-Monitoring
```

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Python
- AWS Lambda
- AWS API Gateway

### Cloud

- AWS Amplify
- Amazon Cognito
- Amazon S3
- Amazon DynamoDB
- Amazon SNS
- Amazon EventBridge
- AWS IAM
- Amazon CloudWatch

### AI

- Google Gemini 3.5 Flash

### External API

- OpenWeather API

### Development

- Git
- GitHub
- AWS CLI
- Google Antigravity

## 📁 Main Application Features

The frontend contains pages/components for:

- Landing
- Login
- Sign Up
- Forgot Password
- Email Verification
- Dashboard
- My Farms
- Farm Details
- My Crops
- Crop Details
- Scan Crop
- Scan Result
- AI Agriculture Assistant
- Weather
- Crop Health History
- Alerts
- Profile
- Settings

## 🚀 Deployment

### Frontend

The frontend is deployed through AWS Amplify.

Production application:

```text
https://main.d5aw1vprjqpf1.amplifyapp.com
```

### Backend

The backend is deployed as an AWS Lambda function:

```text
AgriGuardBackend
```

AWS region:

```text
eu-north-1
```

### API

API Gateway:

```text
AgriGuardAPI
```

Production API base:

```text
https://a53cwd7442.execute-api.eu-north-1.amazonaws.com
```

## 🔌 API Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/weather` | Retrieves live weather information |
| `POST` | `/api` | General authenticated backend/data operation |
| `POST` | `/upload-url` | Generates a presigned S3 upload URL |
| `POST` | `/analyze-crop` | Analyzes an uploaded crop image using Gemini |

## 🧪 Testing and Validation

The project was tested at multiple levels.

### Authentication

- User registration
- Email verification
- Login
- Logout
- Password recovery
- Protected dashboard access

### Weather

The live weather endpoint was tested through API Gateway and successfully returned weather information.

### S3 Upload

Crop images were successfully uploaded using the presigned URL workflow.

### Upload Security

The backend validates:

- File name
- Content type
- Image format
- File size
- Authenticated user ownership

### AI Backend

The crop-analysis Lambda implementation was locally validated for:

- Unauthorized requests
- Invalid S3 ownership
- Missing Gemini API key
- Gemini API failures
- Successful Gemini request
- Model configuration
- Response parsing

The Gemini 3.5 Flash model was also tested with a real crop image and returned structured crop-analysis information.

## 🧠 AI Safety / Reliability

AgriGuard AI does not intentionally force a disease prediction when visual evidence is insufficient.

The AI workflow is designed to:

- Identify visible symptoms.
- Provide a possible condition when supported by the image.
- Avoid inventing a disease.
- Return `"Insufficient evidence"` when appropriate.
- Provide recommendations based on observed information.
- Clearly treat the output as AI-assisted information rather than a laboratory diagnosis.

## 🔮 Future Enhancements

Potential future improvements include:

- AWS Bedrock-based AI analysis
- Bedrock Knowledge Bases / RAG for agriculture-specific knowledge
- More crop disease datasets
- Historical crop health analytics
- Personalized farm recommendations
- Advanced weather-based crop alerts
- Additional notification channels
- More agricultural expert workflows
- Multilingual support
- Production-scale automated monitoring

Amazon Bedrock was evaluated as the planned AWS-native AI option, but the current implementation uses Gemini 3.5 Flash because the selected Bedrock model was not authorized for the account during development.

## 📝 Development Commit History

The following commit history is taken directly from the project's Git repository.

```text
cc3701a | 2026-09-20 | Initial AgriGuard AI frontend
dfcf11e | 2026-09-20 | Connect weather page to live weather API
5fe92c4 | 2026-09-20 | fix: configure production weather API URL
b322be7 | 2026-09-20 | feat: add crop image upload and AI analysis backend
0e95c94 | 2026-09-20 | fix: restore demo crop analysis results
```

### Development progression

```text
Initial Frontend
      ↓
Live Weather Integration
      ↓
Production Weather Configuration
      ↓
Crop Upload + AI Backend
      ↓
Demo Crop Analysis Restoration
```

## 📂 Repository

GitHub repository:

```text
https://github.com/tejasmahajan1103/AgriGuard-AI
```

## 👨‍💻 Project

**Project:** AgriGuard AI  
**Platform:** Web Application  
**Frontend:** React + TypeScript + Vite  
**Backend:** AWS Lambda + API Gateway  
**Cloud:** AWS  
**AI:** Google Gemini 3.5 Flash  
**Weather:** OpenWeather API  
**Database:** Amazon DynamoDB  
**Storage:** Amazon S3  
**Authentication:** Amazon Cognito  
**Notifications:** Amazon SNS  

## ⚠️ Current AI Architecture Note

The current development architecture uses:

```text
Frontend
   ↓
AWS API Gateway
   ↓
AWS Lambda
   ↓
Amazon S3
   ↓
Google Gemini 3.5 Flash
   ↓
Amazon DynamoDB
```

Amazon Bedrock remains a planned future AWS-native AI integration. The current crop-analysis implementation uses Gemini 3.5 Flash to provide the working multimodal AI functionality.

## 🌾 Conclusion

AgriGuard AI demonstrates how serverless AWS infrastructure can be combined with multimodal AI to build a practical agriculture-focused application.

The project integrates authentication, cloud storage, serverless APIs, database storage, notifications, scheduled processing, monitoring, live weather data, and AI-powered crop analysis into a single platform designed around agricultural assistance.
