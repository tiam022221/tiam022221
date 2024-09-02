declare interface PermissionItem {
  name: string;
  subName?: string;
  code?: string;
  openKey?: string;
  defaultPage?: string;
  defaultEnable?: boolean;
  urls?: string[];
  children?: PermissionItem[];
}

