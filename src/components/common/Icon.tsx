import React from 'react';
import {
  Folder,
  Compass,
  Terminal,
  Code,
  Activity,
  FileText,
  Calculator,
  Palette,
  Image,
  ShoppingBag,
  Settings,
  Gamepad2,
  Bomb,
  HardDrive,
  Cloud,
  Cpu,
  Wifi,
  Volume2,
  VolumeX,
  BatteryCharging,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Search,
  Power,
  RotateCw,
  Sun,
  Moon,
  Trash2,
  Edit2,
  Upload,
  Download,
  Plus,
  Play,
  Copy,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  MousePointer,
  Sparkles,
  Info,
  Check,
  Shield,
  Layers,
  Monitor,
  ExternalLink,
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 18 }) => {
  switch (name.toLowerCase()) {
    case 'folder':
      return <Folder size={size} className={className} />;
    case 'compass':
    case 'browser':
      return <Compass size={size} className={className} />;
    case 'terminal':
    case 'cmd':
      return <Terminal size={size} className={className} />;
    case 'code':
    case 'vscode':
      return <Code size={size} className={className} />;
    case 'activity':
    case 'taskmanager':
      return <Activity size={size} className={className} />;
    case 'file-text':
    case 'notepad':
    case 'file':
      return <FileText size={size} className={className} />;
    case 'calculator':
      return <Calculator size={size} className={className} />;
    case 'palette':
    case 'paint':
      return <Palette size={size} className={className} />;
    case 'image':
    case 'photos':
      return <Image size={size} className={className} />;
    case 'shopping-bag':
    case 'store':
      return <ShoppingBag size={size} className={className} />;
    case 'settings':
      return <Settings size={size} className={className} />;
    case 'gamepad-2':
    case 'snake':
      return <Gamepad2 size={size} className={className} />;
    case 'bomb':
    case 'minesweeper':
      return <Bomb size={size} className={className} />;
    case 'hard-drive':
    case 'drive':
      return <HardDrive size={size} className={className} />;
    case 'cloud':
      return <Cloud size={size} className={className} />;
    case 'cpu':
      return <Cpu size={size} className={className} />;
    case 'wifi':
      return <Wifi size={size} className={className} />;
    case 'volume':
      return <Volume2 size={size} className={className} />;
    case 'mute':
      return <VolumeX size={size} className={className} />;
    case 'battery':
      return <BatteryCharging size={size} className={className} />;
    case 'maximize':
      return <Maximize2 size={size} className={className} />;
    case 'minimize':
      return <Minus size={size} className={className} />;
    case 'restore':
      return <Minimize2 size={size} className={className} />;
    case 'close':
      return <X size={size} className={className} />;
    case 'search':
      return <Search size={size} className={className} />;
    case 'power':
      return <Power size={size} className={className} />;
    case 'refresh':
      return <RotateCw size={size} className={className} />;
    case 'sun':
      return <Sun size={size} className={className} />;
    case 'moon':
      return <Moon size={size} className={className} />;
    case 'trash':
      return <Trash2 size={size} className={className} />;
    case 'edit':
      return <Edit2 size={size} className={className} />;
    case 'upload':
      return <Upload size={size} className={className} />;
    case 'download':
      return <Download size={size} className={className} />;
    case 'plus':
      return <Plus size={size} className={className} />;
    case 'play':
      return <Play size={size} className={className} />;
    case 'copy':
      return <Copy size={size} className={className} />;
    case 'chevron-right':
      return <ChevronRight size={size} className={className} />;
    case 'chevron-left':
      return <ChevronLeft size={size} className={className} />;
    case 'arrow-up':
      return <ArrowUp size={size} className={className} />;
    case 'mouse':
    case 'trackpad':
      return <MousePointer size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'info':
      return <Info size={size} className={className} />;
    case 'check':
      return <Check size={size} className={className} />;
    case 'shield':
      return <Shield size={size} className={className} />;
    case 'layers':
      return <Layers size={size} className={className} />;
    case 'monitor':
      return <Monitor size={size} className={className} />;
    case 'external':
      return <ExternalLink size={size} className={className} />;
    default:
      return <FileText size={size} className={className} />;
  }
};
