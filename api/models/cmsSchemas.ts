import mongoose, { Schema, Document } from "mongoose";
import { getDbConnection } from "../lib/mongodb";

// --- 1. MAIN CMS MODELS (dpsi_main) ---

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: "" },
    category: { type: String, default: "General" },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IMenu extends Document {
  title: string;
  url: string;
  location: "header" | "footer_quick" | "footer_resources";
  parent?: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
}

const MenuSchema = new Schema<IMenu>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    location: { type: String, enum: ["header", "footer_quick", "footer_resources"], default: "header" },
    parent: { type: String, default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IPopup extends Document {
  title: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  badgeText?: string;
  buttonText?: string;
  showOnLoad: boolean;
  isActive: boolean;
  isDeleted: boolean;
  startDate?: Date;
  endDate?: Date;
}

const PopupSchema = new Schema<IPopup>(
  {
    title: { type: String, required: true },
    content: { type: String },
    imageUrl: { type: String },
    linkUrl: { type: String },
    badgeText: { type: String, default: "Official Announcement" },
    buttonText: { type: String, default: "Learn More" },
    showOnLoad: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export interface IMarquee extends Document {
  text: string;
  linkUrl?: string;
  speed: number;
  isActive: boolean;
  isDeleted: boolean;
}

const MarqueeSchema = new Schema<IMarquee>(
  {
    text: { type: String, required: true },
    linkUrl: { type: String },
    speed: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IActivity extends Document {
  title: string;
  category: string;
  description: string;
  eventDate: Date;
  imageUrl?: string;
  isPublished: boolean;
  isDeleted: boolean;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    description: { type: String, required: true },
    eventDate: { type: Date, default: Date.now },
    imageUrl: { type: String },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface ISlider extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
}

const SliderSchema = new Schema<ISlider>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    buttonText: { type: String },
    buttonLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IAttachment extends Document {
  title: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  isDeleted: boolean;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Circulars" },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, default: "pdf" },
    fileSize: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IMunRegistration extends Document {
  studentName: string;
  email: string;
  phone: string;
  schoolName: string;
  grade: string;
  committeePreference1: string;
  committeePreference2?: string;
  portfolioPreference1?: string;
  portfolioPreference2?: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "unpaid" | "paid";
  isDeleted: boolean;
}

const MunRegistrationSchema = new Schema<IMunRegistration>(
  {
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    schoolName: { type: String, required: true },
    grade: { type: String, required: true },
    committeePreference1: { type: String, required: true },
    committeePreference2: { type: String },
    portfolioPreference1: { type: String },
    portfolioPreference2: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- 2. GALLERY MODELS (dpsi_gallery) ---

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  isDeleted: boolean;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    coverImage: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IGalleryImage extends Document {
  title: string;
  category: string;
  categoryId?: mongoose.Types.ObjectId;
  imageUrl: string; // Auto-converted WebP URL
  originalUrl?: string;
  width?: number;
  height?: number;
  isPublished: boolean;
  isDeleted: boolean;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Campus" },
    categoryId: { type: Schema.Types.ObjectId, ref: "GalleryCategory" },
    imageUrl: { type: String, required: true },
    originalUrl: { type: String },
    width: { type: Number },
    height: { type: Number },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IVideoGallery extends Document {
  title: string;
  category: string;
  youtubeUrl?: string;
  videoUrl?: string; // WebM URL
  thumbnailUrl?: string;
  isPublished: boolean;
  isDeleted: boolean;
}

const VideoGallerySchema = new Schema<IVideoGallery>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Events" },
    youtubeUrl: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- 3. TC (TRANSFER CERTIFICATE) MODELS (dpsi_tc) ---

export interface ITransferCertificate extends Document {
  admissionNumber: string;
  studentName: string;
  fatherName: string;
  motherName?: string;
  classLeaving: string;
  dateOfIssue: Date;
  certificatePdfUrl: string;
  status: "Issued" | "Pending" | "Cancelled";
  remarks?: string;
  isDeleted: boolean;
}

const TransferCertificateSchema = new Schema<ITransferCertificate>(
  {
    admissionNumber: { type: String, required: true, index: true },
    studentName: { type: String, required: true, index: true },
    fatherName: { type: String, required: true },
    motherName: { type: String },
    classLeaving: { type: String, required: true },
    dateOfIssue: { type: Date, required: true },
    certificatePdfUrl: { type: String, required: true },
    status: { type: String, enum: ["Issued", "Pending", "Cancelled"], default: "Issued" },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- 4. SITE SETTINGS (dpsi_main) ---

export interface ISiteSettings extends Document {
  key: string;
  value: string;
  label: string;
  group: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    group: { type: String, default: "general" },
  },
  { timestamps: true }
);

// --- 5. AI CONFIG (dpsi_main) ---

export interface IAiConfig extends Document {
  systemPrompt: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
}

const AiConfigSchema = new Schema<IAiConfig>(
  {
    systemPrompt: { type: String, required: true },
    modelId: { type: String, default: "llama-3.3-70b-versatile" },
    temperature: { type: Number, default: 0.4 },
    maxTokens: { type: Number, default: 700 },
  },
  { timestamps: true }
);

// --- MODEL GETTERS TIED TO SPECIFIC INTERNAL DATABASES ---

export async function getMainModels() {
  const conn = await getDbConnection("dpsi_main");
  return {
    Page: conn.models.Page || conn.model<IPage>("Page", PageSchema),
    Menu: conn.models.Menu || conn.model<IMenu>("Menu", MenuSchema),
    Popup: conn.models.Popup || conn.model<IPopup>("Popup", PopupSchema),
    Marquee: conn.models.Marquee || conn.model<IMarquee>("Marquee", MarqueeSchema),
    Activity: conn.models.Activity || conn.model<IActivity>("Activity", ActivitySchema),
    Slider: conn.models.Slider || conn.model<ISlider>("Slider", SliderSchema),
    Attachment: conn.models.Attachment || conn.model<IAttachment>("Attachment", AttachmentSchema),
    MunRegistration: conn.models.MunRegistration || conn.model<IMunRegistration>("MunRegistration", MunRegistrationSchema),
    SiteSettings: conn.models.SiteSettings || conn.model<ISiteSettings>("SiteSettings", SiteSettingsSchema),
    AiConfig: conn.models.AiConfig || conn.model<IAiConfig>("AiConfig", AiConfigSchema),
  };
}

export async function getGalleryModels() {
  const conn = await getDbConnection("dpsi_gallery");
  return {
    GalleryCategory: conn.models.GalleryCategory || conn.model<IGalleryCategory>("GalleryCategory", GalleryCategorySchema),
    GalleryImage: conn.models.GalleryImage || conn.model<IGalleryImage>("GalleryImage", GalleryImageSchema),
    VideoGallery: conn.models.VideoGallery || conn.model<IVideoGallery>("VideoGallery", VideoGallerySchema),
  };
}

export async function getTcModels() {
  const conn = await getDbConnection("dpsi_tc");
  return {
    TransferCertificate: conn.models.TransferCertificate || conn.model<ITransferCertificate>("TransferCertificate", TransferCertificateSchema),
  };
}
