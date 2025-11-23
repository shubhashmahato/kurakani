import { Alert } from 'react-native';
import { ERROR_MESSAGES } from './constants';

/**
 * Custom Error Types
 */
export class NetworkError extends Error {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServerError extends Error {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR) {
    super(message);
    this.name = 'ServerError';
  }
}

/**
 * Error Response Interface
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Parse API error response
 */
export const parseErrorResponse = (error: any): ErrorResponse => {
  // Network error
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
    };
  }

  // HTTP error
  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        message: data?.error || ERROR_MESSAGES.INVALID_REQUEST,
        code: 'BAD_REQUEST',
        status,
        details: data,
      };

    case 401:
      return {
        message: data?.error || ERROR_MESSAGES.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
        status,
      };

    case 403:
      return {
        message: data?.error || ERROR_MESSAGES.FORBIDDEN,
        code: 'FORBIDDEN',
        status,
      };

    case 404:
      return {
        message: data?.error || ERROR_MESSAGES.NOT_FOUND,
        code: 'NOT_FOUND',
        status,
      };

    case 408:
      return {
        message: ERROR_MESSAGES.TIMEOUT,
        code: 'TIMEOUT',
        status,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: ERROR_MESSAGES.SERVER_ERROR,
        code: 'SERVER_ERROR',
        status,
      };

    default:
      return {
        message: data?.error || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status,
        details: data,
      };
  }
};

/**
 * Handle API error
 */
export const handleApiError = (
  error: any,
  showAlert: boolean = true
): ErrorResponse => {
  const errorResponse = parseErrorResponse(error);

  // Log error in development
  if (__DEV__) {
    console.error('API Error:', errorResponse);
  }

  // Show alert to user
  if (showAlert) {
    Alert.alert('Error', errorResponse.message);
  }

  return errorResponse;
};

/**
 * Handle authentication error
 */
export const handleAuthError = async (
  error: any,
  logout?: () => Promise<void>
): Promise<void> => {
  const errorResponse = parseErrorResponse(error);

  if (errorResponse.status === 401 && logout) {
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please log in again.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  } else {
    Alert.alert('Authentication Error', errorResponse.message);
  }
};

/**
 * Handle network error
 */
export const handleNetworkError = (error: any): void => {
  Alert.alert(
    'Connection Error',
    'Please check your internet connection and try again.',
    [{ text: 'OK' }]
  );

  if (__DEV__) {
    console.error('Network Error:', error);
  }
};

/**
 * Handle validation error
 */
export const handleValidationError = (
  error: ValidationError | string
): void => {
  const message = typeof error === 'string' ? error : error.message;
  
  Alert.alert('Validation Error', message);
};

/**
 * Handle file upload error
 */
export const handleFileUploadError = (error: any): void => {
  const errorResponse = parseErrorResponse(error);

  let message = errorResponse.message;

  if (errorResponse.code === 'FILE_TOO_LARGE') {
    message = 'File is too large. Please choose a smaller file.';
  } else if (errorResponse.code === 'INVALID_FILE_TYPE') {
    message = 'Invalid file type. Please choose a different file.';
  }

  Alert.alert('Upload Error', message);
};

/**
 * Handle Socket.io error
 */
export const handleSocketError = (error: any): void => {
  if (__DEV__) {
    console.error('Socket Error:', error);
  }

  // Optionally show error to user
  // Alert.alert('Connection Error', 'Real-time connection lost. Trying to reconnect...');
};

/**
 * Handle call error
 */
export const handleCallError = (error: any): void => {
  const errorResponse = parseErrorResponse(error);

  let message = errorResponse.message;

  if (errorResponse.code === 'PERMISSION_DENIED') {
    message = 'Camera/Microphone permission denied. Please enable in settings.';
  } else if (errorResponse.code === 'CALL_BUSY') {
    message = 'User is busy on another call.';
  } else if (errorResponse.code === 'CALL_DECLINED') {
    message = 'Call was declined.';
  } else if (errorResponse.code === 'CALL_TIMEOUT') {
    message = 'No answer. Call timed out.';
  }

  Alert.alert('Call Error', message);
};

/**
 * Handle media error
 */
export const handleMediaError = (error: any): void => {
  if (__DEV__) {
    console.error('Media Error:', error);
  }

  Alert.alert(
    'Media Error',
    'Failed to load media. Please try again.'
  );
};

/**
 * Handle permission error
 */
export const handlePermissionError = (
  permission: string,
  error?: any
): void => {
  if (__DEV__ && error) {
    console.error(`${permission} Permission Error:`, error);
  }

  Alert.alert(
    'Permission Required',
    `Please grant ${permission} permission in your device settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Open Settings', 
        onPress: () => {
          // Open app settings
          // Linking.openSettings();
        }
      },
    ]
  );
};

/**
 * Show error toast (alternative to Alert)
 */
export const showErrorToast = (message: string): void => {
  // Implement with your toast library
  console.log('Error Toast:', message);
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string): void => {
  // Implement with your toast library
  console.log('Success Toast:', message);
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string): void => {
  // Implement with your toast library
  console.log('Warning Toast:', message);
};

/**
 * Log error to external service (Sentry, etc.)
 */
export const logError = (
  error: Error,
  context?: any
): void => {
  if (__DEV__) {
    console.error('Error logged:', error, context);
  }

  // Send to error tracking service
  // Sentry.captureException(error, { extra: context });
};

/**
 * Retry failed operation
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

/**
 * Safe async operation with error handling
 */
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  onError?: (error: any) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      handleApiError(error);
    }
    return null;
  }
};

/**
 * Wrap component with error boundary
 */
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
      logError(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Something went wrong.</Text>
            <Button title="Try Again" onPress={() => this.setState({ hasError: false })} />
          </View>
        );
      }

      return <Component {...this.props} />;
    }
  };
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return 'Please check your internet connection.';
  }

  if (error instanceof AuthenticationError) {
    return 'Please log in again.';
  }

  if (error instanceof ServerError) {
    return 'Server error. Please try again later.';
  }

  const errorResponse = parseErrorResponse(error);
  return errorResponse.message;
};

/**
 * Check if error is recoverable
 */
export const isRecoverableError = (error: any): boolean => {
  const errorResponse = parseErrorResponse(error);
  
  // Network errors and timeouts are recoverable
  if (errorResponse.code === 'NETWORK_ERROR' || errorResponse.code === 'TIMEOUT') {
    return true;
  }

  // 5xx server errors are recoverable
  if (errorResponse.status && errorResponse.status >= 500) {
    return true;
  }

  return false;
};

export default {
  NetworkError,
  AuthenticationError,
  ValidationError,
  ServerError,
  parseErrorResponse,
  handleApiError,
  handleAuthError,
  handleNetworkError,
  handleValidationError,
  handleFileUploadError,
  handleSocketError,
  handleCallError,
  handleMediaError,
  handlePermissionError,
  showErrorToast,
  showSuccessToast,
  showWarningToast,
  logError,
  retryOperation,
  safeAsync,
  withErrorBoundary,
  getUserFriendlyError,
  isRecoverableError,
};