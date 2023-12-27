export default interface CancellationToken {
  isCancellationRequested: boolean;
  onCancellationRequested: (callback: () => void) => void;
  cancellationCallback?: () => void;
}
