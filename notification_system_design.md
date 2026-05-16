
## Project Structure
22MIS1110/
├── logging_middleware/
│   ├── src/
│   │   ├── logger.ts           
│   │   ├── express-middleware.ts 
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── notification_app_be/
│   ├── src/
│   │   ├── config.ts          
│   │   ├── database.ts       
│   │   ├── priority-algorithm.ts 
│   │   ├── email-service.ts   
│   │   ├── notification-service.ts 
│   │   ├── routes.ts          
│   │   └── index.ts           
│   ├── package.json
│   └── tsconfig.json
├── notification_app_fe/
│   ├── src/
│   │   ├── components/        
│   │   ├── hooks/             
│   │   ├── utils/            
│   │   ├── styles/            
│   │   ├── page.tsx           
│   │   ├── layout.tsx         
│   │   ├── app.tsx           
│   │   └── types.ts          
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── notification_system_design.md 
├── .gitignore
## Stage Implementation Summary
### Stage 1: REST API Design 
- 6 API endpoints for notification management
- JSON schema with type, priority, timestamp
- Real-time polling mechanism
### Stage 2: Reliable Storage 
- Multi-field indexed database schema
- Atomic operations for consistency
- Timestamp-based ordering
### Stage 3: Performance Optimization 
- O(log n) query efficiency
- Handles 50,000+ records
- Pagination and lazy loading
### Stage 4: Page Load Optimization 
- Initial batch: 20 notifications
- Background refresh: 30 seconds
- Load more functionality
### Stage 5: Bulk Notifications 
- Batch endpoint for multiple students
- Email service with retry logic
- Async queue processing
- Can send to 50,000+ student
### Stage 6: Priority Algorithm 
- 4-level priority system (1-4)
- Type-based weighting (Event, Result, Placement)
- Keyword-based scoring
- Recency boost
- Unread notification boost
### Stage 7: Responsive Frontend 
- Priority Inbox view
- All Notifications list with filters
- Statistics dashboard
- Mobile-responsive design
- Real-time mark as read
