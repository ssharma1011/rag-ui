import { useEffect, useRef } from 'react';
import { workflowApi } from '../services/api';
import { WorkflowStatusResponse } from '../types/workflow';

interface UseWorkflowPollingProps {
  conversationId: string | null;
  isProcessing: boolean;
  onStatusUpdate: (status: WorkflowStatusResponse) => void;
  onError: (error: Error) => void;
  pollingInterval?: number;
}

/**
 * Custom hook to poll workflow status while processing
 */
export const useWorkflowPolling = ({
  conversationId,
  isProcessing,
  onStatusUpdate,
  onError,
  pollingInterval = 2000, // 2 seconds default
}: UseWorkflowPollingProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start polling if we have a conversation ID and are processing
    if (!conversationId || !isProcessing) {
      return;
    }

    const pollStatus = async () => {
      try {
        const status = await workflowApi.getWorkflowStatus(conversationId);
        onStatusUpdate(status);

        // Stop polling if workflow is complete or failed
        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        onError(error as Error);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Start polling immediately
    pollStatus();

    // Set up interval for continuous polling
    intervalRef.current = setInterval(pollStatus, pollingInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [conversationId, isProcessing, onStatusUpdate, onError, pollingInterval]);
};
