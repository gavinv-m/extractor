| User Name           | Role / Type / Field                  | What Could Be Going Wrong (Edge Case)                                              |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| **Alice Admin**     | `ADMIN`, `PROFESSIONAL` (Finance)    | Tests elevated privileges, risk of accidentally seeing/manipulating all user data. |
| **Bob Undergrad**   | `USER`, `STUDENT` (Undergrad)        | Free plan but trying to upload more pages than allowed. Checks quota enforcement.  |
| **Clara PhD**       | `USER`, `STUDENT` (PhD)              | Cancelled subscription still within endDate; tests access during grace period.     |
| **Dan Engineer**    | `USER`, `PROFESSIONAL` (Engineering) | Payment failed multiple times; tests handling of failed payment retries.           |
| **Eva Doctor**      | `USER`, `PROFESSIONAL` (Medical)     | Has multiple active subscriptions; tests duplicate billing prevention.             |
| **Frank Legal**     | `USER`, `PROFESSIONAL` (Legal)       | Queries Azure with 0 pages processed; tests empty or malformed query handling.     |
| **Grace Other**     | `USER`, `OTHER`                      | No studentType or professionalField set; tests required/optional field handling.   |
| **Hugo HighUsage**  | `USER`, `STUDENT` (Undergrad)        | Exceeded monthly usage dramatically; tests throttling and overage alerts.          |
| **Ivy Refund**      | `USER`, `PROFESSIONAL` (Finance)     | Payment refunded after completion; tests refunds and reporting consistency.        |
| **Jake Processing** | `USER`, `OTHER`                      | Azure query stuck in `PROCESSING` status; tests timeout/cleanup logic.             |
| **Nina Inactive**   | `USER`, `STUDENT` (PhD)              | Subscription created but never activated (`INACTIVE`).                             |
| **Omar AddOn**      | `USER`, `PROFESSIONAL` (Engineering) | Purchased add-on pages, tests add-on precedence.                                   |
| **Maya Zero**       | `USER`, `PROFESSIONAL` (Medical)     | Subscription valid, but monthly usage fully consumed.                              |
| **Logan Audit**     | `USER`, `OTHER`                      | Heavy audit logs, tests log volume/performance.                                    |
| **Anon Visitor**    | `OTHER` (anonymous)                  | PageVisit with only `clientId` + `ip`, no `userId`.                                |
| **Penny Pending**   | `USER`, `STUDENT` (Undergrad)        | Payment stuck in `PENDING`.                                                        |
| **Eddie Exhausted** | `USER`, `PROFESSIONAL` (Legal)       | Add-on purchased, all add-on pages already consumed.                               |
