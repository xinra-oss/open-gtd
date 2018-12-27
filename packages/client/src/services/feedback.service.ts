import { message } from 'antd'

export interface FeedbackService {
  successMessage(message: string, duration?: number): void
  warningMessage(message: string, duration?: number): void
  errorMessage(message: string, duration?: number): void
}

export const antDesignFeedback: FeedbackService = {
  successMessage: (msg, duration) => message.success(msg, duration),
  warningMessage: (msg, duration) => message.warning(msg, duration),
  errorMessage: (msg, duration) => message.error(msg, duration)
}
