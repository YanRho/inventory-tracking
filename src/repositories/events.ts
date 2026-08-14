type Listener = () => void;

class ChangeEmitter {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const deviceEvents = new ChangeEmitter();
export const batchEvents = new ChangeEmitter();
