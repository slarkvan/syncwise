export interface BasePlugin {
  type?: 'button' | 'checkbox';
  eventHandler?: () => void;
  name: string;
  description: string;
  default: boolean;
  init?(): void;
  observer?(): void;
}
