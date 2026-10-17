import { FileItem } from '../types/os';

const STORAGE_KEY = 'cloudpc_filesystem_v1';

const INITIAL_FILESYSTEM: FileItem[] = [
  // Root Drives
  {
    id: 'drive-c',
    name: 'Local Disk (C:)',
    type: 'folder',
    size: 24500000000,
    updatedAt: new Date().toISOString(),
    parentId: null,
    path: 'C:',
    isSystem: true,
  },
  {
    id: 'drive-d',
    name: 'Cloud Drive (D:)',
    type: 'folder',
    size: 154000000,
    updatedAt: new Date().toISOString(),
    parentId: null,
    path: 'D:',
    isSystem: true,
  },

  // C: Subfolders
  {
    id: 'folder-users',
    name: 'Users',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'drive-c',
    path: 'C:/Users',
    isSystem: true,
  },
  {
    id: 'folder-user',
    name: 'User',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-users',
    path: 'C:/Users/User',
    isSystem: true,
  },
  {
    id: 'folder-desktop',
    name: 'Desktop',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-user',
    path: 'C:/Users/User/Desktop',
    isSystem: true,
  },
  {
    id: 'folder-documents',
    name: 'Documents',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-user',
    path: 'C:/Users/User/Documents',
    isSystem: true,
  },
  {
    id: 'folder-downloads',
    name: 'Downloads',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-user',
    path: 'C:/Users/User/Downloads',
    isSystem: true,
  },
  {
    id: 'folder-pictures',
    name: 'Pictures',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-user',
    path: 'C:/Users/User/Pictures',
    isSystem: true,
  },

  // Desktop Files
  {
    id: 'file-welcome',
    name: 'Welcome to CloudPC.txt',
    type: 'file',
    extension: 'txt',
    size: 1420,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-desktop',
    path: 'C:/Users/User/Desktop/Welcome to CloudPC.txt',
    content: `=====================================================
  WELCOME TO CLOUDPC - 100% FREE VIRTUAL WINDOWS PC
=====================================================

Aapke mobile phone ka koi bhi RAM ya phone storage use nahi hoga!
All operations run in your dedicated high-speed Cloud PC container.

* CLOUD SPECS ALLOCATED:
- Virtual Cloud RAM: 32 GB DDR5 (Zero load on your device)
- Cloud Storage: 512 GB High-Speed NVMe Cloud Array
- Virtual Cloud Processor: 16-Core Ultra Xeon @ 4.20 GHz
- Network: 980 Mbps Gigabit Cloud Uplink

* WHAT YOU CAN DO:
1. File Explorer: Create, edit, rename, upload files from your phone and download to device.
2. Web Browser: Search, visit links, research on Wikipedia, and open web tools.
3. VS Code Studio: Write JavaScript, Python, HTML code, run test scripts, and build apps.
4. CMD & PowerShell: Run terminal commands (dir, ping, systeminfo, calc, curl, free).
5. Task Manager: Monitor live Cloud CPU, Cloud RAM, and kill processes.
6. Phone Touch & Trackpad Mode: Toggle the virtual mouse trackpad for fine cursor precision on small mobile touchscreens!

Enjoy your true Free Virtual Cloud PC experience!`,
  },
  {
    id: 'file-guide',
    name: 'Mobile Phone Guide.txt',
    type: 'file',
    extension: 'txt',
    size: 890,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-desktop',
    path: 'C:/Users/User/Desktop/Mobile Phone Guide.txt',
    content: `MOBILE USER TIPS:
----------------------------------------
1. Virtual Trackpad:
   Tap the Quick Settings icon (bottom right tray) or the Trackpad button to open a floating mouse pad. You can slide your thumb to steer the pointer, click Left, Right, or Scroll!
2. Full Screen:
   Tap the Full Screen icon in the taskbar or Settings for an edge-to-edge PC gaming & desktop view.
3. Windows Snap:
   Double tap the titlebar of any window to maximize it, or drag windows smoothly across the desktop.
4. Cloud Drive (D:):
   Store all your large files in Drive D: without taking even 1 MB of your phone storage!`,
  },
  {
    id: 'file-sample-code',
    name: 'app_sample.js',
    type: 'file',
    extension: 'js',
    size: 640,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-desktop',
    path: 'C:/Users/User/Desktop/app_sample.js',
    content: `// Sample Cloud PC JavaScript
console.log("Starting Virtual Cloud Runtime...");

const specs = {
  ram: "32 GB DDR5 Virtual Cloud RAM",
  storage: "512 GB Cloud NVMe",
  speed: "980 Mbps Uplink",
  status: "Active & Healthy"
};

function checkStatus() {
  return "All Cloud systems running at 100% capacity!";
}

console.log("Cloud Specs:", specs);
console.log(checkStatus());
`,
  },

  // Documents
  {
    id: 'file-notes',
    name: 'Cloud RAM & Storage Architecture.txt',
    type: 'file',
    extension: 'txt',
    size: 780,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-documents',
    path: 'C:/Users/User/Documents/Cloud RAM & Storage Architecture.txt',
    content: `CLOUD ARCHITECTURE OVERVIEW:
---------------------------------------------
- Cloud Ram Allocator:
  Uses isolated virtual heap buffers with zero drain on local battery and phone memory.
- Cloud Persistent Disk:
  Virtual persistent block storage synced in IndexedDB & local storage cache with zero phone storage footprint.
- Real-time Task Manager:
  Calculates true simulation loads and process telemetry.`,
  },

  // D: Cloud Drive folders
  {
    id: 'folder-d-projects',
    name: 'Cloud Projects',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'drive-d',
    path: 'D:/Cloud Projects',
  },
  {
    id: 'folder-d-backups',
    name: 'Cloud Backups',
    type: 'folder',
    size: 4096,
    updatedAt: new Date().toISOString(),
    parentId: 'drive-d',
    path: 'D:/Cloud Backups',
  },
  {
    id: 'file-d-project-notes',
    name: 'Project Roadmap.txt',
    type: 'file',
    extension: 'txt',
    size: 512,
    updatedAt: new Date().toISOString(),
    parentId: 'folder-d-projects',
    path: 'D:/Cloud Projects/Project Roadmap.txt',
    content: `Project Cloud Studio:
1. Deploy virtual code sandbox
2. Connect cloud storage bucket
3. Multi-window multi-tasking on mobile screen`,
  },
];

class CloudStorageService {
  private files: FileItem[] = [];

  constructor() {
    this.loadFiles();
  }

  private loadFiles(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.files = JSON.parse(data);
      } else {
        this.files = [...INITIAL_FILESYSTEM];
        this.saveToStorage();
      }
    } catch {
      this.files = [...INITIAL_FILESYSTEM];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.files));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }

  public getAllFiles(): FileItem[] {
    return [...this.files];
  }

  public getFilesByParent(parentId: string | null): FileItem[] {
    return this.files.filter((f) => f.parentId === parentId);
  }

  public getDesktopFiles(): FileItem[] {
    return this.files.filter((f) => f.parentId === 'folder-desktop');
  }

  public getFileById(id: string): FileItem | undefined {
    return this.files.find((f) => f.id === id);
  }

  public getFileByPath(path: string): FileItem | undefined {
    return this.files.find((f) => f.path.toLowerCase() === path.toLowerCase());
  }

  public createFile(
    name: string,
    parentId: string,
    content: string = '',
    extension?: string
  ): FileItem {
    const parent = this.getFileById(parentId);
    const parentPath = parent ? parent.path : 'C:';
    const ext = extension || name.split('.').pop() || 'txt';
    const cleanName = name.includes('.') ? name : `${name}.${ext}`;

    const newFile: FileItem = {
      id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      type: 'file',
      extension: ext,
      size: new Blob([content]).size || 120,
      updatedAt: new Date().toISOString(),
      parentId,
      path: `${parentPath}/${cleanName}`,
      content,
    };

    this.files.push(newFile);
    this.saveToStorage();
    return newFile;
  }

  public createFolder(name: string, parentId: string): FileItem {
    const parent = this.getFileById(parentId);
    const parentPath = parent ? parent.path : 'C:';

    const newFolder: FileItem = {
      id: 'folder-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name,
      type: 'folder',
      size: 4096,
      updatedAt: new Date().toISOString(),
      parentId,
      path: `${parentPath}/${name}`,
    };

    this.files.push(newFolder);
    this.saveToStorage();
    return newFolder;
  }

  public deleteItem(id: string): boolean {
    const target = this.getFileById(id);
    if (!target || target.isSystem) return false;

    // Recursively delete children if folder
    const toDeleteIds = new Set<string>([id]);
    let added = true;
    while (added) {
      added = false;
      for (const item of this.files) {
        if (item.parentId && toDeleteIds.has(item.parentId) && !toDeleteIds.has(item.id)) {
          toDeleteIds.add(item.id);
          added = true;
        }
      }
    }

    this.files = this.files.filter((item) => !toDeleteIds.has(item.id));
    this.saveToStorage();
    return true;
  }

  public renameItem(id: string, newName: string): boolean {
    const item = this.getFileById(id);
    if (!item || item.isSystem) return false;

    item.name = newName;
    if (item.type === 'file' && newName.includes('.')) {
      item.extension = newName.split('.').pop();
    }
    item.updatedAt = new Date().toISOString();

    // Update path
    const parts = item.path.split('/');
    parts[parts.length - 1] = newName;
    item.path = parts.join('/');

    this.saveToStorage();
    return true;
  }

  public saveContent(id: string, content: string): boolean {
    const item = this.getFileById(id);
    if (!item || item.type !== 'file') return false;

    item.content = content;
    item.size = new Blob([content]).size;
    item.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return true;
  }

  public async uploadRealFile(file: File, parentId: string): Promise<FileItem> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const isText = file.type.startsWith('text/') || file.name.match(/\.(txt|md|js|ts|json|html|css|py|csv|xml)$/i);

      reader.onload = () => {
        const content = reader.result as string;
        const created = this.createFile(file.name, parentId, content);
        created.size = file.size;
        this.saveToStorage();
        resolve(created);
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  }

  public downloadVirtualFile(item: FileItem): void {
    if (item.type !== 'file') return;
    const content = item.content || '';
    let blob: Blob;

    if (content.startsWith('data:')) {
      // Base64 dataUrl
      const arr = content.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else {
      blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public calculateUsedStorageGb(): number {
    const totalBytes = this.files.reduce((acc, f) => acc + (f.size || 0), 0);
    // Add base virtual OS size (approx 22.4 GB)
    return parseFloat(((totalBytes / (1024 * 1024 * 1024)) + 22.4).toFixed(2));
  }

  public resetToDefault(): void {
    this.files = [...INITIAL_FILESYSTEM];
    this.saveToStorage();
  }
}

export const cloudStorage = new CloudStorageService();
