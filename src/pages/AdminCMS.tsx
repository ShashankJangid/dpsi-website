import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  FileText,
  Image as ImageIcon,
  Video,
  BellRing,
  Paperclip,
  Activity,
  SlidersHorizontal,
  Megaphone,
  Award,
  Globe2,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Lock,
  User,
  Key,
  ArrowRight,
  AlertTriangle,
  Play,
  Settings,
  Bot,
  Download,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  Copy,
  X,
  Bell,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type TabType =
  | "dashboard"
  | "pages"
  | "menus"
  | "gallery"
  | "videos"
  | "popups"
  | "marquee"
  | "activities"
  | "sliders"
  | "attachments"
  | "tc"
  | "mun"
  | "site_settings"
  | "ai_settings";

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("dpsi_admin_token");
  });
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [pageModal, setPageModal] = useState(false);
  const [pageForm, setPageForm] = useState({ title: "", slug: "", content: "", category: "General" });

  const [menuModal, setMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState<{
    title: string;
    url: string;
    location: "header" | "footer_quick" | "footer_resources";
    parent: string;
    order: number;
  }>({
    title: "",
    url: "",
    location: "header",
    parent: "",
    order: 0,
  });

  const [popupModal, setPopupModal] = useState(false);
  const [popupForm, setPopupForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    linkUrl: "",
    badgeText: "Official Notice",
    buttonText: "Learn More",
  });

  const utils = trpc.useUtils();

  // Queries
  const { data: stats, refetch: refetchStats } = trpc.cms.dashboardStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: pagesList, refetch: refetchPages } = trpc.cms.listPages.useQuery({ showTrash: false }, {
    enabled: isAuthenticated,
  });
  const { data: menusList, refetch: refetchMenus } = trpc.cms.listMenus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: popupsList, refetch: refetchPopups } = trpc.cms.listPopups.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: marqueesList, refetch: refetchMarquees } = trpc.cms.listMarquees.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: activitiesList, refetch: refetchActivities } = trpc.cms.listActivities.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: slidersList, refetch: refetchSliders } = trpc.cms.listSliders.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: attachmentsList, refetch: refetchAttachments } = trpc.cms.listAttachments.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: galleryImages, refetch: refetchGallery } = trpc.cms.listGalleryImages.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: videoList, refetch: refetchVideos } = trpc.cms.listVideos.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [tcSearch, setTcSearch] = useState("");
  const { data: tcList, refetch: refetchTc } = trpc.cms.listTc.useQuery({ search: tcSearch }, {
    enabled: isAuthenticated,
  });
  const { data: munList, refetch: refetchMun } = trpc.cms.listMunRegistrations.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: siteSettings, refetch: refetchSiteSettings } = trpc.cms.getSiteSettings.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: aiConfig, refetch: refetchAiConfig } = trpc.cms.getAiConfig.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const adminLoginMutation = trpc.cms.adminLogin.useMutation();
  const uploadTranscode = trpc.cms.uploadAndTranscode.useMutation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await adminLoginMutation.mutateAsync({
        username: adminUsername,
        password: adminPassword,
      });

      if (res.success) {
        toast.success(`Welcome back, ${res.user?.username}!`);
        setIsAuthenticated(true);
        localStorage.setItem("dpsi_admin_auth", "true");
        localStorage.setItem("dpsi_admin_user", res.user?.username || "Admin");
      } else {
        setLoginError(res.error || "Invalid username or password");
        toast.error(res.error || "Authentication failed");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to authenticate");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dpsi_admin_auth");
    localStorage.removeItem("dpsi_admin_user");
    setIsAuthenticated(false);
    toast.info("Logged out of Admin Portal");
  };

  // CRUD Mutations
  const createPage = trpc.cms.createPage.useMutation({
    onSuccess: () => {
      toast.success("Page published successfully!");
      refetchPages();
      refetchStats();
      setPageModal(false);
    },
  });
  const deletePage = trpc.cms.deletePage.useMutation({
    onSuccess: () => {
      toast.success("Page deleted");
      refetchPages();
      refetchStats();
    },
  });

  const createMenu = trpc.cms.createMenu.useMutation({
    onSuccess: () => {
      toast.success("Menu item created!");
      refetchMenus();
      setMenuModal(false);
    },
  });
  const updateMenu = trpc.cms.updateMenu.useMutation({
    onSuccess: () => {
      toast.success("Menu item updated!");
      refetchMenus();
      setMenuModal(false);
      setEditingMenuId(null);
    },
  });
  const deleteMenu = trpc.cms.deleteMenu.useMutation({
    onSuccess: () => {
      toast.success("Menu item deleted");
      refetchMenus();
    },
  });

  const [selectedMenuLocation, setSelectedMenuLocation] = useState<"all" | "header" | "footer_quick" | "footer_resources">("all");
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  const createPopup = trpc.cms.createPopup.useMutation({
    onSuccess: () => {
      toast.success("Popup notice published!");
      refetchPopups();
      refetchStats();
      setPopupModal(false);
    },
  });
  const togglePopup = trpc.cms.togglePopup.useMutation({
    onSuccess: (data: any) => {
      toast.success(`Popup ${data?.isActive ? "enabled" : "disabled"} successfully!`);
      refetchPopups();
      refetchStats();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to toggle popup");
    },
  });
  const deletePopup = trpc.cms.deletePopup.useMutation({
    onSuccess: () => {
      toast.success("Popup deleted");
      refetchPopups();
      refetchStats();
    },
  });

  const createMarquee = trpc.cms.createMarquee.useMutation({
    onSuccess: () => {
      toast.success("Marquee alert added!");
      refetchMarquees();
      setMarqueeModal(false);
    },
  });
  const deleteMarquee = trpc.cms.deleteMarquee.useMutation({
    onSuccess: () => {
      toast.success("Marquee deleted");
      refetchMarquees();
    },
  });

  const createActivity = trpc.cms.createActivity.useMutation({
    onSuccess: () => {
      toast.success("Activity item created!");
      refetchActivities();
      refetchStats();
      setActivityModal(false);
    },
  });
  const deleteActivity = trpc.cms.deleteActivity.useMutation({
    onSuccess: () => {
      toast.success("Activity deleted");
      refetchActivities();
      refetchStats();
    },
  });

  const createSlider = trpc.cms.createSlider.useMutation({
    onSuccess: () => {
      toast.success("Slider item created!");
      refetchSliders();
      refetchStats();
      setSliderModal(false);
    },
  });
  const deleteSlider = trpc.cms.deleteSlider.useMutation({
    onSuccess: () => {
      toast.success("Slider deleted");
      refetchSliders();
      refetchStats();
    },
  });

  const createAttachment = trpc.cms.createAttachment.useMutation({
    onSuccess: () => {
      toast.success("Attachment/Circular added!");
      refetchAttachments();
      refetchStats();
      setAttachmentModal(false);
    },
  });
  const deleteAttachment = trpc.cms.deleteAttachment.useMutation({
    onSuccess: () => {
      toast.success("Attachment deleted");
      refetchAttachments();
      refetchStats();
    },
  });

  const createGalleryImage = trpc.cms.createGalleryImage.useMutation({
    onSuccess: () => {
      toast.success("Image uploaded & transcoded to WebP via Cloudinary!");
      refetchGallery();
      refetchStats();
      setGalleryModal(false);
    },
  });
  const deleteGalleryImage = trpc.cms.deleteGalleryImage.useMutation({
    onSuccess: () => {
      toast.success("Gallery image deleted");
      refetchGallery();
      refetchStats();
    },
  });

  const createVideo = trpc.cms.createVideo.useMutation({
    onSuccess: () => {
      toast.success("Video added to Gallery!");
      refetchVideos();
      refetchStats();
      setVideoModal(false);
      setVideoForm({ title: "", category: "Events", youtubeUrl: "", thumbnailUrl: "" });
    },
  });
  const updateVideo = trpc.cms.updateVideo.useMutation({
    onSuccess: () => {
      toast.success("Video updated!");
      refetchVideos();
      setVideoModal(false);
      setEditingVideoId(null);
    },
  });
  const deleteVideo = trpc.cms.deleteVideo.useMutation({
    onSuccess: () => {
      toast.success("Video deleted");
      refetchVideos();
      refetchStats();
    },
  });

  const createTc = trpc.cms.createTc.useMutation({
    onSuccess: () => {
      toast.success("Transfer Certificate record created!");
      refetchTc();
      refetchStats();
      setTcModal(false);
    },
  });
  const bulkCreateTc = trpc.cms.bulkCreateTc.useMutation({
    onSuccess: (data) => {
      toast.success(`Bulk import complete: ${data.inserted} records inserted!`);
      refetchTc();
      refetchStats();
      setBulkTcModal(false);
      setBulkCsvText("");
      setBulkPreviewRows([]);
    },
    onError: (err: any) => {
      toast.error(err.message || "Bulk import failed");
    },
  });
  const deleteTc = trpc.cms.deleteTc.useMutation({
    onSuccess: () => {
      toast.success("TC record deleted");
      refetchTc();
      refetchStats();
    },
  });

  const updatePage = trpc.cms.updatePage.useMutation({
    onSuccess: () => {
      toast.success("Page updated!");
      refetchPages();
      setPageModal(false);
      setEditingPageId(null);
    },
  });

  const updateSlider = trpc.cms.updateSlider.useMutation({
    onSuccess: () => {
      toast.success("Slider updated!");
      refetchSliders();
      setSliderModal(false);
      setEditingSlider(null);
    },
  });

  const updateActivity = trpc.cms.updateActivity.useMutation({
    onSuccess: () => {
      toast.success("Activity updated!");
      refetchActivities();
      setActivityModal(false);
      setEditingActivity(null);
    },
  });

  const updateMarquee = trpc.cms.updateMarquee.useMutation({
    onSuccess: () => {
      toast.success("Marquee updated!");
      refetchMarquees();
      setMarqueeModal(false);
      setEditingMarquee(null);
    },
  });

  const updateAttachment = trpc.cms.updateAttachment.useMutation({
    onSuccess: () => {
      toast.success("Attachment updated!");
      refetchAttachments();
      setAttachmentModal(false);
      setEditingAttachment(null);
    },
  });

  const toggleMenuMutation = trpc.cms.toggleMenu.useMutation({
    onSuccess: (data: any) => {
      toast.success(`Menu item ${data?.isActive ? "shown" : "hidden"}`);
      refetchMenus();
    },
  });

  const updateSiteSettingsMutation = trpc.cms.updateSiteSettings.useMutation({
    onSuccess: () => {
      toast.success("Site settings saved!");
      refetchSiteSettings();
    },
  });

  const updateAiConfigMutation = trpc.cms.updateAiConfig.useMutation({
    onSuccess: () => {
      toast.success("AI configuration saved and active!");
      refetchAiConfig();
    },
  });

  const updatePopup = trpc.cms.updatePopup.useMutation({
    onSuccess: () => {
      toast.success("Popup updated!");
      refetchPopups();
      setPopupModal(false);
      setEditingPopup(null);
    },
  });

  // Modal Form States
  const [marqueeModal, setMarqueeModal] = useState(false);
  const [marqueeForm, setMarqueeForm] = useState({ text: "", linkUrl: "", speed: 50 });

  const [activityModal, setActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: "", category: "Academics", description: "", imageUrl: "" });

  const [sliderModal, setSliderModal] = useState(false);
  const [sliderForm, setSliderForm] = useState({ title: "", subtitle: "", imageUrl: "", buttonText: "Learn More", buttonLink: "/" });

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachmentForm, setAttachmentForm] = useState({ title: "", category: "Circulars", fileUrl: "", fileName: "" });

  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: "", category: "Campus", imageUrl: "" });

  const [videoModal, setVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: "", category: "Events", youtubeUrl: "", thumbnailUrl: "" });

  const [tcModal, setTcModal] = useState(false);
  const [tcForm, setTcForm] = useState({
    admissionNumber: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    classLeaving: "Class X",
    dateOfIssue: new Date().toISOString().split("T")[0],
    certificatePdfUrl: "",
    status: "Issued" as "Issued" | "Pending" | "Cancelled",
  });

  // Editing IDs for all sections
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingSlider, setEditingSlider] = useState<any | null>(null);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [editingMarquee, setEditingMarquee] = useState<any | null>(null);
  const [editingAttachment, setEditingAttachment] = useState<any | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);

  // Bulk TC Import
  const [bulkTcModal, setBulkTcModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [bulkPreviewRows, setBulkPreviewRows] = useState<any[]>([]);

  // Site Settings local state
  const [settingsEdits, setSettingsEdits] = useState<Record<string, string>>({});

  // AI Config local state
  const [aiPromptEdit, setAiPromptEdit] = useState("");
  const [aiModelEdit, setAiModelEdit] = useState("llama-3.3-70b-versatile");
  const [aiTempEdit, setAiTempEdit] = useState(0.4);

  const safeIsoDate = (val: any) => {
    if (!val) return "";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const safeFormatDate = (val: any) => {
    if (!val) return "N/A";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const parseBulkCsv = (text: string) => {
    const lines = text.trim().split("\n").filter(l => l.trim());
    const rows: any[] = [];
    for (const line of lines) {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 5) {
        rows.push({
          admissionNumber: parts[0] || "",
          studentName: parts[1] || "",
          fatherName: parts[2] || "",
          motherName: parts[3] || "",
          classLeaving: parts[4] || "Class X",
          dateOfIssue: safeIsoDate(parts[5]) || new Date().toISOString().split("T")[0],
          status: (["Issued", "Pending", "Cancelled"].includes(parts[6]) ? parts[6] : "Issued") as "Issued" | "Pending" | "Cancelled",
        });
      }
    }
    return rows;
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleMediaUpload = async (file: File, callback: (webpUrl: string) => void) => {
    try {
      setIsUploading(true);
      toast.info(`Uploading ${file.name} to Cloudinary CDN with auto-WebP...`);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await uploadTranscode.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          base64Data,
        });
        if (res.success && res.dataUrl) {
          toast.success(`Uploaded to Cloudinary CDN! Size: ${Math.round((res.size || 0) / 1024)} KB`);
          callback(res.dataUrl);
        } else {
          toast.error("Failed to upload media");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const navMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, count: null },
    { id: "pages", label: "Manage Pages", icon: <FileText className="w-4 h-4" />, count: stats?.pages },
    { id: "menus", label: "Manage Menus", icon: <MenuIcon className="w-4 h-4" />, count: null },
    { id: "gallery", label: "Image Gallery", icon: <ImageIcon className="w-4 h-4" />, count: stats?.galleryImages },
    { id: "videos", label: "Video Gallery", icon: <Video className="w-4 h-4" />, count: stats?.videos },
    { id: "popups", label: "Popups", icon: <BellRing className="w-4 h-4" />, count: stats?.popups },
    { id: "marquee", label: "Marquee Ticker", icon: <Megaphone className="w-4 h-4" />, count: null },
    { id: "activities", label: "Activities", icon: <Activity className="w-4 h-4" />, count: stats?.activities },
    { id: "sliders", label: "Home Sliders", icon: <SlidersHorizontal className="w-4 h-4" />, count: stats?.sliders },
    { id: "attachments", label: "Attachments", icon: <Paperclip className="w-4 h-4" />, count: stats?.attachments },
    { id: "tc", label: "Transfer Certificate", icon: <Award className="w-4 h-4" />, count: stats?.transferCertificates },
    { id: "mun", label: "MUN Registration", icon: <Globe2 className="w-4 h-4" />, count: stats?.munRegistrations },
    { id: "site_settings", label: "Site Settings", icon: <Settings className="w-4 h-4" />, count: null },
    { id: "ai_settings", label: "AI Configuration", icon: <Bot className="w-4 h-4" />, count: null },
  ];

  // 🔒 LIGHT LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20 text-white">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">DPSI Admin Portal</h2>
              <p className="text-sm text-slate-500 mt-1">Delhi Public School Indirapuram CMS</p>
            </div>

            {loginError && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <Input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Admin"
                    className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={adminLoginMutation.isPending}
                className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {adminLoginMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to CMS <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Authorized Personnel Only • DPS Indirapuram IT Cell
              </p>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // 🔓 LIGHT THEME AUTHENTICATED DASHBOARD
  return (
    <Layout>
      <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
        {/* Top Header Bar */}
        <div className="border-b border-slate-200 bg-white shadow-sm px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-slate-900">DPS Indirapuram CMS</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
                  Admin: {localStorage.getItem("dpsi_admin_user") || "Admin"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Delhi Public School Indirapuram • Administration Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchStats();
                toast.success("Database synced with MongoDB!");
              }}
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-8 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync DB
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-200 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs h-8 ml-1 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Nav Bar */}
            <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-xl p-3 shadow-sm shrink-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Menu Navigation
              </div>
              <div className="space-y-1">
                {navMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === item.id
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeTab === item.id
                            ? "bg-emerald-950/50 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Main Body Content Panel */}
            <div className="flex-1 w-full min-w-0">
              {/* 1. DASHBOARD */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">System Overview</h2>
                    <p className="text-xs text-slate-500">Live operational metrics & database records</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {[
                      { title: "Manage Page", val: stats?.pages ?? 0, icon: <FileText className="w-4 h-4" />, tab: "pages" },
                      { title: "Gallery WebP", val: stats?.galleryImages ?? 0, icon: <ImageIcon className="w-4 h-4" />, tab: "gallery" },
                      { title: "TC Records", val: stats?.transferCertificates ?? 0, icon: <Award className="w-4 h-4" />, tab: "tc" },
                      { title: "Activity Cards", val: stats?.activities ?? 0, icon: <Activity className="w-4 h-4" />, tab: "activities" },
                      { title: "Active Popups", val: stats?.popups ?? 0, icon: <BellRing className="w-4 h-4" />, tab: "popups" },
                      { title: "Home Sliders", val: stats?.sliders ?? 0, icon: <SlidersHorizontal className="w-4 h-4" />, tab: "sliders" },
                      { title: "Attachments", val: stats?.attachments ?? 0, icon: <Paperclip className="w-4 h-4" />, tab: "attachments" },
                      { title: "MUN Delegates", val: stats?.munRegistrations ?? 0, icon: <Globe2 className="w-4 h-4" />, tab: "mun" },
                    ].map((card, i) => (
                      <Card
                        key={i}
                        onClick={() => setActiveTab(card.tab as TabType)}
                        className="bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group"
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500 group-hover:text-emerald-700 font-medium transition-colors">
                              {card.title}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.val}</h3>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {card.icon}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Cloudinary CDN & Auto-WebP Active
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 text-xs text-slate-600 space-y-1.5">
                        <p>• All image formats (JPEG, PNG, HEIC) are converted to WebP and delivered from high-speed Cloudinary CDN.</p>
                        <p>• Gallery and TC data are preserved in isolated MongoDB database scopes.</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Admin Session
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 text-xs text-slate-600 space-y-1.5">
                        <p>• Logged in as: <strong className="text-slate-900">Admin</strong></p>
                        <p>• SHA-256 salted password hashing enabled on MongoDB cloud.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* 2. MANAGE PAGES */}
              {activeTab === "pages" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Manage Pages</h2>
                      <p className="text-xs text-slate-500">All Pages • Add Page • Page Trash</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPageId(null);
                        setPageForm({ title: "", slug: "", content: "", category: "General" });
                        setPageModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Page
                    </Button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Page Title</th>
                          <th className="px-4 py-3">Slug</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pagesList?.map((p: any) => (
                          <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">{p.title}</td>
                            <td className="px-4 py-3 font-mono text-emerald-700">
                              <a
                                href={`/${p.slug.replace(/^\/+/, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-1 inline-flex"
                              >
                                /{p.slug} <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{p.category || "General"}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                Published
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-emerald-700 hover:bg-emerald-50 h-7 px-2"
                                title="View Live Page"
                                onClick={() => window.open(`/${p.slug.replace(/^\/+/, "")}`, "_blank")}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                                title="Edit Page"
                                onClick={() => {
                                  setEditingPageId(p._id);
                                  setPageForm({
                                    title: p.title || "",
                                    slug: p.slug || "",
                                    content: p.content || "",
                                    category: p.category || "General",
                                  });
                                  setPageModal(true);
                                }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50 h-7 px-2"
                                title="Delete Page"
                                onClick={() => deletePage.mutate({ id: p._id })}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {(!pagesList || pagesList.length === 0) && (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-400">
                              No pages created yet. Click "Add Page" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* 3. IMAGE GALLERY */}
              {activeTab === "gallery" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Image Gallery (Auto-WebP)</h2>
                      <p className="text-xs text-slate-500">Cloudinary CDN Storage • Add Images • All Images</p>
                    </div>
                    <Button onClick={() => setGalleryModal(true)} size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Images
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {galleryImages?.map((img: any) => (
                      <div key={img._id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-sm">
                        <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                          <span className="self-end px-1.5 py-0.5 rounded bg-emerald-500 text-[9px] font-bold text-black uppercase">
                            WebP
                          </span>
                          <div>
                            <p className="text-white text-xs font-semibold">{img.title}</p>
                            <p className="text-slate-300 text-[10px]">{img.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGalleryImage.mutate({ id: img._id })}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(!galleryImages || galleryImages.length === 0) && (
                      <div className="col-span-full text-center py-10 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs bg-white">
                        No gallery images yet. Upload any JPEG or PNG to auto-convert to WebP.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 4. TC (TRANSFER CERTIFICATE) */}
              {activeTab === "tc" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Transfer Certificate (TC) Portal</h2>
                      <p className="text-xs text-slate-500">Add TC • TC List • Trash TC (Database: `dpsi_tc`)</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <Input
                          placeholder="Search Adm No / Name..."
                          value={tcSearch}
                          onChange={(e) => setTcSearch(e.target.value)}
                          className="pl-8 bg-white border-slate-200 text-slate-900 text-xs h-8"
                        />
                      </div>
                      <Button
                        onClick={() => { setBulkCsvText(""); setBulkPreviewRows([]); setBulkTcModal(true); }}
                        size="sm"
                        variant="outline"
                        className="border-slate-300 text-slate-700 text-xs h-8"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Bulk Import
                      </Button>
                      <Button onClick={() => setTcModal(true)} size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8 shadow-sm">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add TC
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Adm No.</th>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Father's Name</th>
                          <th className="px-4 py-3">Class Leaving</th>
                          <th className="px-4 py-3">Date of Issue</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tcList?.map((tc: any) => (
                          <tr key={tc._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-emerald-700">{tc.admissionNumber}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{tc.studentName}</td>
                            <td className="px-4 py-3 text-slate-600">{tc.fatherName}</td>
                            <td className="px-4 py-3 text-slate-500">{tc.classLeaving}</td>
                            <td className="px-4 py-3 text-slate-500">{safeFormatDate(tc.dateOfIssue)}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                {tc.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50 h-7 px-2"
                                onClick={() => deleteTc.mutate({ id: tc._id })}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {(!tcList || tcList.length === 0) && (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400">
                              No TC records found. Click "Add TC" to create a new record.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* 5. POPUP */}
              {activeTab === "popups" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Popup Notification</h2>
                      <p className="text-xs text-slate-500">Customizable website modal alert with image & CTA</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPopup(null);
                        setPopupForm({
                          title: "",
                          content: "",
                          imageUrl: "",
                          linkUrl: "",
                          badgeText: "Official Notice",
                          buttonText: "Learn More",
                        });
                        setPopupModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Popup
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {popupsList?.map((p: any) => (
                      <Card key={p._id} className="bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                        <div>
                          {p.imageUrl && (
                            <div className="w-full h-36 bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {p.badgeText || "Official Notice"}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-[9px] rounded font-medium ${
                                  p.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {p.isActive ? "Active" : "Disabled"}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 text-sm leading-snug">{p.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-3">{p.content || "No description"}</p>
                            {p.linkUrl && (
                              <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 pt-1 truncate">
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="truncate">{p.buttonText || "Button"}: {p.linkUrl}</span>
                              </div>
                            )}
                          </CardContent>
                        </div>
                        <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 text-[10px] h-7 px-2"
                            onClick={() => togglePopup.mutate({ id: p._id, isActive: !p.isActive })}
                          >
                            {p.isActive ? "Disable" : "Enable"}
                          </Button>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                              title="Edit Popup"
                              onClick={() => {
                                setEditingPopup(p._id);
                                setPopupForm({
                                  title: p.title || "",
                                  content: p.content || "",
                                  imageUrl: p.imageUrl || "",
                                  linkUrl: p.linkUrl || "",
                                  badgeText: p.badgeText || "Official Notice",
                                  buttonText: p.buttonText || "Learn More",
                                });
                                setPopupModal(true);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 h-7 px-2"
                              title="Delete Popup"
                              onClick={() => deletePopup.mutate({ id: p._id })}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {(!popupsList || popupsList.length === 0) && (
                      <div className="col-span-full text-center py-8 text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                        No popups created. Click "Add Popup" to create an announcement notice.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 6. MARQUEE */}
              {activeTab === "marquee" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Marquee</h2>
                      <p className="text-xs text-slate-500">Add Marquee • Marquee List • Live Ticker Sync</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingMarquee(null);
                        setMarqueeForm({ text: "", linkUrl: "", speed: 50 });
                        setMarqueeModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Marquee
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {marqueesList?.map((m: any) => (
                      <Card key={m._id} className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Megaphone className="w-4 h-4 text-emerald-700 shrink-0" />
                            <p className="text-xs text-slate-900 font-medium">{m.text}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                              title="Edit Marquee"
                              onClick={() => {
                                setEditingMarquee(m._id);
                                setMarqueeForm({
                                  text: m.text || "",
                                  linkUrl: m.linkUrl || "",
                                  speed: m.speed || 50,
                                });
                                setMarqueeModal(true);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 h-7 px-2"
                              title="Delete Marquee"
                              onClick={() => deleteMarquee.mutate({ id: m._id })}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 7. RECENT ACTIVITY */}
              {activeTab === "activities" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                      <p className="text-xs text-slate-500">Manage Category • Add Recent Activity • Recent Activity List</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingActivity(null);
                        setActivityForm({ title: "", category: "Sports", description: "", eventDate: "", imageUrl: "" });
                        setActivityModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Activity
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {activitiesList?.map((act: any) => (
                      <Card key={act._id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        {act.imageUrl && (
                          <div className="h-36 w-full overflow-hidden bg-slate-100">
                            <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <CardContent className="p-3.5 flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {act.category}
                            </span>
                            <h3 className="font-semibold text-slate-900 text-xs mt-1.5">{act.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.description}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                              title="Edit Activity"
                              onClick={() => {
                                setEditingActivity(act._id);
                                setActivityForm({
                                  title: act.title || "",
                                  category: act.category || "General",
                                  description: act.description || "",
                                  eventDate: safeIsoDate(act.eventDate),
                                  imageUrl: act.imageUrl || "",
                                });
                                setActivityModal(true);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 h-7 px-2"
                              title="Delete Activity"
                              onClick={() => deleteActivity.mutate({ id: act._id })}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 8. ATTACHMENT */}
              {activeTab === "attachments" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Attachment / Circulars</h2>
                      <p className="text-xs text-slate-500">Add Attachment • Attachment List</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingAttachment(null);
                        setAttachmentForm({ title: "", category: "Circulars", fileUrl: "", fileName: "" });
                        setAttachmentModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Attachment
                    </Button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">File Name</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attachmentsList?.map((att: any) => (
                          <tr key={att._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                              <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                              {att.title}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{att.category}</td>
                            <td className="px-4 py-3 font-mono text-slate-600">{att.fileName}</td>
                            <td className="px-4 py-3 text-right space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                                title="Edit Attachment"
                                onClick={() => {
                                  setEditingAttachment(att._id);
                                  setAttachmentForm({
                                    title: att.title || "",
                                    category: att.category || "Circulars",
                                    fileUrl: att.fileUrl || "",
                                    fileName: att.fileName || "",
                                  });
                                  setAttachmentModal(true);
                                }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50 h-7 px-2"
                                title="Delete Attachment"
                                onClick={() => deleteAttachment.mutate({ id: att._id })}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* 9. MUN REGISTRATIONS */}
              {activeTab === "mun" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">MUN Registration</h2>
                    <p className="text-xs text-slate-500">Registration List</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Delegate</th>
                          <th className="px-4 py-3">School / Grade</th>
                          <th className="px-4 py-3">Committee Pref</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {munList?.map((m: any) => (
                          <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-slate-900">{m.studentName}</p>
                              <p className="text-[10px] text-slate-500">{m.email} | {m.phone}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{m.schoolName}<br /><span className="text-slate-500">{m.grade}</span></td>
                            <td className="px-4 py-3 text-slate-700 font-mono">{m.committeePreference1}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {(!munList || munList.length === 0) && (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-slate-400">No registrations yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* 10. HOME SLIDERS */}
              {activeTab === "sliders" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Hero Banners & Sliders</h2>
                      <p className="text-xs text-slate-500">Live Homepage Slider Images • Order & Captions</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingSlider(null);
                        setSliderForm({ title: "", subtitle: "", imageUrl: "", buttonText: "Apply Now", buttonLink: "/admissions", order: 0 });
                        setSliderModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Slider
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slidersList?.map((s: any) => (
                      <Card key={s._id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                          <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white font-mono">
                            Order: {s.order}
                          </div>
                        </div>
                        <CardContent className="p-4 flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                            {s.subtitle && <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                                Button: {s.buttonText || "Apply Now"} ({s.buttonLink || "/"})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:bg-slate-100 h-8 px-2"
                              title="Edit Slider"
                              onClick={() => {
                                setEditingSlider(s._id);
                                setSliderForm({
                                  title: s.title || "",
                                  subtitle: s.subtitle || "",
                                  imageUrl: s.imageUrl || "",
                                  buttonText: s.buttonText || "Apply Now",
                                  buttonLink: s.buttonLink || "/admissions",
                                  order: s.order || 0,
                                });
                                setSliderModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 h-8 px-2"
                              title="Delete Slider"
                              onClick={() => deleteSlider.mutate({ id: s._id })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!slidersList || slidersList.length === 0) && (
                      <div className="col-span-full text-center py-10 bg-white border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
                        No custom sliders created yet. Currently displaying default hero slides. Click "Add Slider" to customize the homepage banner!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 11. VIDEO GALLERY */}
              {activeTab === "videos" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Video Gallery</h2>
                      <p className="text-xs text-slate-500">YouTube Embeds — Managed from Admin Portal</p>
                    </div>
                    <Button onClick={() => { setEditingVideoId(null); setVideoForm({ title: "", category: "Events", youtubeUrl: "", thumbnailUrl: "" }); setVideoModal(true); }} size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Video
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoList?.map((v: any) => (
                      <Card key={v._id} className="bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                            {v.thumbnailUrl ? (
                              <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-800 text-xs">No Thumbnail</div>
                            )}
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-[10px] text-white font-bold">
                              {v.category || "Events"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-slate-900 text-xs line-clamp-2">{v.title}</h3>
                            <p className="font-mono text-[10px] text-slate-400 mt-1 truncate">{v.youtubeUrl || v.videoUrl}</p>
                          </div>
                        </div>
                        <div className="p-4 pt-0 flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                            onClick={() => {
                              setEditingVideoId(v._id);
                              setVideoForm({ title: v.title, category: v.category || "Events", youtubeUrl: v.youtubeUrl || "", thumbnailUrl: v.thumbnailUrl || "" });
                              setVideoModal(true);
                            }}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50 h-7 px-2"
                            onClick={() => deleteVideo.mutate({ id: v._id })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {(!videoList || videoList.length === 0) && (
                      <div className="col-span-full text-center py-10 bg-white border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs">
                        No videos added yet. Click "Add Video" to add a YouTube video.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 13. SITE SETTINGS */}
              {activeTab === "site_settings" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Site Settings</h2>
                      <p className="text-xs text-slate-500">Global School Information — Controls Contact, Social, and General Info across entire website</p>
                    </div>
                    <Button
                      onClick={() => {
                        const updates = (siteSettings || []).map((s: any) => ({
                          key: s.key,
                          value: settingsEdits[s.key] !== undefined ? settingsEdits[s.key] : s.value,
                        }));
                        updateSiteSettingsMutation.mutate({ updates });
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                      disabled={updateSiteSettingsMutation.isPending}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      {updateSiteSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
                    </Button>
                  </div>

                  {["general", "contact", "admissions", "social"].map((group) => (
                    <div key={group} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">{group}</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {(siteSettings || []).filter((s: any) => s.group === group).map((s: any) => (
                          <div key={s.key} className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">{s.label}</label>
                            <Input
                              value={settingsEdits[s.key] !== undefined ? settingsEdits[s.key] : s.value}
                              onChange={(e) => setSettingsEdits({ ...settingsEdits, [s.key]: e.target.value })}
                              className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                            />
                            <p className="text-[10px] text-slate-400 font-mono">{s.key}</p>
                          </div>
                        ))}
                        {(siteSettings || []).filter((s: any) => s.group === group).length === 0 && (
                          <p className="text-xs text-slate-400">Loading settings...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 14. AI CONFIGURATION */}
              {activeTab === "ai_settings" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">AI Chatbot Configuration</h2>
                    <p className="text-xs text-slate-500">Edit the AI assistant knowledge base and parameters — changes take effect immediately</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 font-medium">The AI uses this knowledge base to answer all student and parent queries on the website. Keep it accurate and up to date.</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">AI Model</label>
                        <select
                          value={aiModelEdit || aiConfig?.modelId || "llama-3.3-70b-versatile"}
                          onChange={(e) => setAiModelEdit(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs"
                        >
                          <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Recommended — Fast)</option>
                          <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
                          <option value="mixtral-8x7b-32768">Mixtral 8x7B (Balanced)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">Temperature (Creativity: 0 = strict, 1 = creative)</label>
                        <Input
                          type="number"
                          min={0}
                          max={1}
                          step={0.1}
                          value={aiTempEdit || aiConfig?.temperature || 0.4}
                          onChange={(e) => setAiTempEdit(parseFloat(e.target.value) || 0.4)}
                          className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">Max Response Length (tokens)</label>
                        <Input
                          type="number"
                          min={100}
                          max={2000}
                          value={700}
                          disabled
                          className="bg-slate-50 border-slate-200 text-slate-400 text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-600">School Knowledge Base (AI System Prompt)</label>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-slate-500 h-6 px-2"
                          onClick={() => setAiPromptEdit(aiConfig?.systemPrompt || "")}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Load Current
                        </Button>
                      </div>
                      <Textarea
                        rows={18}
                        placeholder="Enter the complete school knowledge base here. Include: contact info, facilities, admissions, fee structure, leadership, achievements, etc."
                        value={aiPromptEdit || aiConfig?.systemPrompt || ""}
                        onChange={(e) => setAiPromptEdit(e.target.value)}
                        className="bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400">{(aiPromptEdit || aiConfig?.systemPrompt || "").length} characters. More detail = better AI answers.</p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => updateAiConfigMutation.mutate({
                          systemPrompt: aiPromptEdit || aiConfig?.systemPrompt || "",
                          modelId: aiModelEdit || aiConfig?.modelId || "llama-3.3-70b-versatile",
                          temperature: aiTempEdit || aiConfig?.temperature || 0.4,
                          maxTokens: 700,
                        })}
                        disabled={updateAiConfigMutation.isPending}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                      >
                        <Bot className="w-3.5 h-3.5 mr-1.5" />
                        {updateAiConfigMutation.isPending ? "Saving..." : "Save AI Configuration"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 12. MANAGE MENUS */}
              {activeTab === "menus" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Manage Navigation Menus</h2>
                      <p className="text-xs text-slate-500">Header & Footer Nav Links • Fully Customizable & Live</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingMenuId(null);
                        setMenuForm({ title: "", url: "", location: "header", parent: "", order: 1 });
                        setMenuModal(true);
                      }}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Menu Item
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    {[
                      { id: "all", label: "All Menus" },
                      { id: "header", label: "Header Main Nav" },
                      { id: "footer_quick", label: "Footer Quick Links" },
                      { id: "footer_resources", label: "Footer Resources" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedMenuLocation(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          selectedMenuLocation === tab.id
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Menu Title</th>
                          <th className="px-4 py-3">Target URL</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Parent Menu</th>
                          <th className="px-4 py-3">Order</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {menusList
                          ?.filter((m: any) =>
                            selectedMenuLocation === "all" ? true : m.location === selectedMenuLocation
                          )
                          .map((m: any) => (
                            <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                                {m.parent && <span className="text-slate-400 font-mono">└─</span>}
                                {m.title}
                              </td>
                              <td className="px-4 py-3 font-mono text-emerald-700">{m.url}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium capitalize">
                                  {m.location === "header"
                                    ? "Header Nav"
                                    : m.location === "footer_quick"
                                    ? "Footer Quick"
                                    : "Footer Resources"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-500">{m.parent || "—"}</td>
                              <td className="px-4 py-3 font-mono text-slate-600">{m.order}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${m.isActive !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                                  {m.isActive !== false ? "Visible" : "Hidden"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-500 hover:bg-slate-100 h-7 px-2"
                                  title={m.isActive !== false ? "Hide from nav" : "Show in nav"}
                                  onClick={() => toggleMenuMutation.mutate({ id: m._id, isActive: !(m.isActive !== false) })}
                                >
                                  {m.isActive !== false ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-600 hover:bg-slate-100 h-7 px-2"
                                  onClick={() => {
                                    setEditingMenuId(m._id);
                                    setMenuForm({
                                      title: m.title,
                                      url: m.url,
                                      location: m.location || "header",
                                      parent: m.parent || "",
                                      order: m.order || 0,
                                    });
                                    setMenuModal(true);
                                  }}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:bg-red-50 h-7 px-2"
                                  onClick={() => deleteMenu.mutate({ id: m._id })}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        {(!menusList || menusList.length === 0) && (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-slate-400">
                              No navigation items found. Click "Add Menu Item" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* LIGHT THEME MODALS */}
        {/* MODAL: ADD / EDIT PAGE */}
        {pageModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingPageId ? "Edit Page" : "Create New Page"}
                </h3>
                <button
                  onClick={() => {
                    setPageModal(false);
                    setEditingPageId(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Page Title</label>
                  <Input
                    placeholder="e.g. Science Labs"
                    value={pageForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      if (!editingPageId) {
                        setPageForm({
                          ...pageForm,
                          title: newTitle,
                          slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                        });
                      } else {
                        setPageForm({ ...pageForm, title: newTitle });
                      }
                    }}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Category</label>
                  <select
                    value={pageForm.category || "General"}
                    onChange={(e) => setPageForm({ ...pageForm, category: e.target.value })}
                    className="w-full h-9 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs px-2.5 outline-none focus:border-emerald-600"
                  >
                    <option value="General">General</option>
                    <option value="About">About</option>
                    <option value="Academics">Academics</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Campus">Campus</option>
                    <option value="Policy">Policy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">URL Slug</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-400">dpsindirapuram.com/</span>
                  <Input
                    placeholder="science-labs"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") })}
                    className="bg-slate-50 border-slate-200 text-slate-900 font-mono text-xs flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Page Content (WYSIWYG Editor)</label>
                <RichTextEditor
                  value={pageForm.content}
                  onChange={(val) => setPageForm({ ...pageForm, content: val })}
                  placeholder="Design your page content, headings, formatting..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPageModal(false);
                    setEditingPageId(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingPageId) {
                      updatePage.mutate({ id: editingPageId, ...pageForm });
                    } else {
                      createPage.mutate(pageForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingPageId ? "Save Changes" : "Publish Page"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD GALLERY IMAGE */}
        {galleryModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Upload Gallery Image (Cloudinary Auto-WebP)</h3>
                <button
                  onClick={() => setGalleryModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Input
                placeholder="Image Title / Caption"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <select
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs"
              >
                <option value="Campus">Campus</option>
                <option value="Sports">Sports</option>
                <option value="Events">Events</option>
                <option value="Academics">Academics</option>
                <option value="Laboratories">Laboratories</option>
              </select>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-600 transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">Select JPEG, PNG, or HEIC file</p>
                <p className="text-[10px] text-slate-500 mt-1">Uploaded directly to Cloudinary CDN in WebP format</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleMediaUpload(file, (webpUrl) => {
                        setGalleryForm({ ...galleryForm, imageUrl: webpUrl });
                      });
                    }
                  }}
                  className="mt-4 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              {galleryForm.imageUrl && (
                <div className="relative rounded-lg overflow-hidden h-28 bg-slate-100 border border-slate-200">
                  <img src={galleryForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-700 text-[9px] text-white font-bold">
                    Cloudinary WebP Ready
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setGalleryModal(false)} className="text-slate-600 text-xs">Cancel</Button>
                <Button
                  disabled={!galleryForm.imageUrl || isUploading}
                  onClick={() => createGalleryImage.mutate(galleryForm)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  Save Image
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT SLIDER */}
        {sliderModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingSlider ? "Edit Hero Banner" : "Add Hero Slider Banner"}
                </h3>
                <button
                  onClick={() => {
                    setSliderModal(false);
                    setEditingSlider(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Slider Title (e.g. Admissions Open 2026-27)"
                value={sliderForm.title}
                onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="Subtitle (e.g. Excellence in CBSE Education)"
                value={sliderForm.subtitle}
                onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Button Text (e.g. Apply Now)"
                  value={sliderForm.buttonText}
                  onChange={(e) => setSliderForm({ ...sliderForm, buttonText: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
                <Input
                  placeholder="Button Link (e.g. /admissions)"
                  value={sliderForm.buttonLink}
                  onChange={(e) => setSliderForm({ ...sliderForm, buttonLink: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-600 transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">Select Banner Image</p>
                <p className="text-[10px] text-slate-500 mt-1">Uploaded directly to Cloudinary CDN in WebP format</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleMediaUpload(file, (webpUrl) => {
                        setSliderForm({ ...sliderForm, imageUrl: webpUrl });
                      });
                    }
                  }}
                  className="mt-4 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              {sliderForm.imageUrl && (
                <div className="relative rounded-lg overflow-hidden h-28 bg-slate-100 border border-slate-200">
                  <img src={sliderForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-700 text-[9px] text-white font-bold">
                    WebP Ready
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSliderModal(false);
                    setEditingSlider(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!sliderForm.title || !sliderForm.imageUrl}
                  onClick={() => {
                    if (editingSlider) {
                      updateSlider.mutate({ id: editingSlider, ...sliderForm });
                    } else {
                      createSlider.mutate(sliderForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingSlider ? "Update Slider" : "Save Slider"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT VIDEO */}
        {videoModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingVideoId ? "Edit Video" : "Add Video to Gallery"}
                </h3>
                <button
                  onClick={() => {
                    setVideoModal(false);
                    setEditingVideoId(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Video Title (e.g. AI Lab Tour 2026)"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">YouTube URL or Video ID</label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  value={videoForm.youtubeUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    try {
                      let thumbUrl = videoForm.thumbnailUrl;
                      if (val.length >= 10) {
                        const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                        const vid = match?.[1] ?? (val.length === 11 ? val : "");
                        if (vid) thumbUrl = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                      }
                      setVideoForm({ ...videoForm, youtubeUrl: val, thumbnailUrl: thumbUrl });
                    } catch {
                      setVideoForm({ ...videoForm, youtubeUrl: val });
                    }
                  }}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono"
                />
                <p className="text-[10px] text-slate-400">Paste the full YouTube URL or just the 11-character video ID</p>
              </div>
              <select
                value={videoForm.category}
                onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs"
              >
                <option value="Events">Events</option>
                <option value="Campus">Campus</option>
                <option value="Sports">Sports</option>
                <option value="Academics">Academics</option>
                <option value="Robotics">Robotics</option>
                <option value="MUN">MUN</option>
                <option value="Cultural">Cultural</option>
              </select>

              {videoForm.thumbnailUrl && (
                <div className="relative rounded-lg overflow-hidden h-32 bg-slate-900 border border-slate-200">
                  <img src={videoForm.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => { setVideoModal(false); setEditingVideoId(null); setVideoForm({ title: "", category: "Events", youtubeUrl: "", thumbnailUrl: "" }); }} className="text-slate-600 text-xs">Cancel</Button>
                <Button
                  disabled={!videoForm.title || !videoForm.youtubeUrl}
                  onClick={() => {
                    if (editingVideoId) {
                      updateVideo.mutate({ id: editingVideoId, ...videoForm });
                    } else {
                      createVideo.mutate(videoForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                >
                  {editingVideoId ? "Update Video" : "Save Video"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT MENU ITEM */}
        {menuModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingMenuId ? "Edit Navigation Menu Item" : "Add Navigation Menu Item"}
                </h3>
                <button
                  onClick={() => {
                    setMenuModal(false);
                    setEditingMenuId(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Menu Title</label>
                <Input
                  placeholder="e.g. Admissions, Curriculum, About Us"
                  value={menuForm.title}
                  onChange={(e) => setMenuForm({ ...menuForm, title: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Target URL / Link</label>
                <Input
                  placeholder="e.g. /admissions, /about#vision, or https://..."
                  value={menuForm.url}
                  onChange={(e) => setMenuForm({ ...menuForm, url: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Menu Placement Location</label>
                <select
                  value={menuForm.location}
                  onChange={(e) => setMenuForm({ ...menuForm, location: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2 text-xs"
                >
                  <option value="header">Header Main Nav (Top Bar)</option>
                  <option value="footer_quick">Footer Quick Links (Bottom Left)</option>
                  <option value="footer_resources">Footer Resources & Portals (Bottom Right)</option>
                </select>
              </div>

              {menuForm.location === "header" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Parent Menu (Optional for Dropdowns)</label>
                  <Input
                    placeholder="e.g. About or Academics (leave empty for main level)"
                    value={menuForm.parent}
                    onChange={(e) => setMenuForm({ ...menuForm, parent: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Display Order</label>
                <Input
                  type="number"
                  placeholder="1"
                  value={menuForm.order}
                  onChange={(e) => setMenuForm({ ...menuForm, order: parseInt(e.target.value) || 0 })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuModal(false);
                    setEditingMenuId(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!menuForm.title || !menuForm.url}
                  onClick={() => {
                    if (editingMenuId) {
                      updateMenu.mutate({
                        id: editingMenuId,
                        ...menuForm,
                      });
                    } else {
                      createMenu.mutate(menuForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingMenuId ? "Update Menu Item" : "Save Menu Item"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD TC RECORD */}
        {tcModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Add Transfer Certificate (TC)</h3>
                <button
                  onClick={() => setTcModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Admission No. (e.g. DPSI-1082)"
                  value={tcForm.admissionNumber}
                  onChange={(e) => setTcForm({ ...tcForm, admissionNumber: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 font-mono text-xs"
                />
                <Input
                  placeholder="Student Full Name"
                  value={tcForm.studentName}
                  onChange={(e) => setTcForm({ ...tcForm, studentName: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Father's Name"
                  value={tcForm.fatherName}
                  onChange={(e) => setTcForm({ ...tcForm, fatherName: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
                <Input
                  placeholder="Class Leaving (e.g. Class X)"
                  value={tcForm.classLeaving}
                  onChange={(e) => setTcForm({ ...tcForm, classLeaving: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>
              <Input
                type="date"
                value={tcForm.dateOfIssue}
                onChange={(e) => setTcForm({ ...tcForm, dateOfIssue: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="TC Certificate PDF / Scan URL"
                value={tcForm.certificatePdfUrl}
                onChange={(e) => setTcForm({ ...tcForm, certificatePdfUrl: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setTcModal(false)} className="text-slate-600 text-xs">Cancel</Button>
                <Button
                  disabled={!tcForm.admissionNumber || !tcForm.studentName}
                  onClick={() => createTc.mutate({
                    ...tcForm,
                    certificatePdfUrl: tcForm.certificatePdfUrl || "https://dpsindirapuram.com/tc/sample.pdf",
                  })}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  Save TC Record
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT POPUP */}
        {popupModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingPopup ? "Edit Popup Notice" : "Create Popup Notice"}
                </h3>
                <button
                  onClick={() => {
                    setPopupModal(false);
                    setEditingPopup(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Popup Banner Image Upload & Direct URL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Popup Banner Image (Optional)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Image URL or Cloudinary CDN link"
                    value={popupForm.imageUrl}
                    onChange={(e) => setPopupForm({ ...popupForm, imageUrl: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 shrink-0 border border-slate-200 font-medium">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleMediaUpload(file, (url) => setPopupForm({ ...popupForm, imageUrl: url }));
                        }
                      }}
                    />
                  </label>
                </div>
                {popupForm.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-h-32 bg-slate-50 flex items-center justify-center">
                    <img src={popupForm.imageUrl} alt="Preview" className="max-h-32 object-contain" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Badge Tag (e.g. Official Notice, Admissions Open)</label>
                <Input
                  placeholder="Official Notice"
                  value={popupForm.badgeText}
                  onChange={(e) => setPopupForm({ ...popupForm, badgeText: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Popup Title</label>
                <Input
                  placeholder="e.g. Admissions Open for Academic Session 2026-27"
                  value={popupForm.title}
                  onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Notice Content</label>
                <Textarea
                  placeholder="Enter notice description or announcements..."
                  rows={3}
                  value={popupForm.content}
                  onChange={(e) => setPopupForm({ ...popupForm, content: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Button Text</label>
                  <Input
                    placeholder="Learn More"
                    value={popupForm.buttonText}
                    onChange={(e) => setPopupForm({ ...popupForm, buttonText: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Action Link URL</label>
                  <Input
                    placeholder="/admissions or https://..."
                    value={popupForm.linkUrl}
                    onChange={(e) => setPopupForm({ ...popupForm, linkUrl: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPopupModal(false);
                    setEditingPopup(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!popupForm.title}
                  onClick={() => {
                    if (editingPopup) {
                      updatePopup.mutate({ id: editingPopup, ...popupForm });
                    } else {
                      createPopup.mutate(popupForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingPopup ? "Update Popup" : "Publish Popup"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT MARQUEE */}
        {marqueeModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingMarquee ? "Edit Marquee Announcement" : "Add Marquee Announcement"}
                </h3>
                <button
                  onClick={() => {
                    setMarqueeModal(false);
                    setEditingMarquee(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Marquee Text"
                value={marqueeForm.text}
                onChange={(e) => setMarqueeForm({ ...marqueeForm, text: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="Optional Target URL (e.g. /admissions)"
                value={marqueeForm.linkUrl}
                onChange={(e) => setMarqueeForm({ ...marqueeForm, linkUrl: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMarqueeModal(false);
                    setEditingMarquee(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingMarquee) {
                      updateMarquee.mutate({ id: editingMarquee, ...marqueeForm });
                    } else {
                      createMarquee.mutate(marqueeForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingMarquee ? "Update Marquee" : "Save Marquee"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT ACTIVITY */}
        {activityModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingActivity ? "Edit Activity" : "Add Activity"}
                </h3>
                <button
                  onClick={() => {
                    setActivityModal(false);
                    setEditingActivity(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Activity Title"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="Category (e.g. Sports, Robotics, Arts)"
                value={activityForm.category}
                onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Textarea
                placeholder="Activity Description"
                rows={3}
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="Image URL (Optional)"
                value={activityForm.imageUrl}
                onChange={(e) => setActivityForm({ ...activityForm, imageUrl: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActivityModal(false);
                    setEditingActivity(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingActivity) {
                      updateActivity.mutate({ id: editingActivity, ...activityForm });
                    } else {
                      createActivity.mutate(activityForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingActivity ? "Update Activity" : "Save Activity"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT ATTACHMENT */}
        {attachmentModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {editingAttachment ? "Edit Attachment / Circular" : "Add Attachment / Circular"}
                </h3>
                <button
                  onClick={() => {
                    setAttachmentModal(false);
                    setEditingAttachment(null);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Document Title"
                value={attachmentForm.title}
                onChange={(e) => setAttachmentForm({ ...attachmentForm, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="Category (e.g. Circulars, DateSheet, Syllabus)"
                value={attachmentForm.category}
                onChange={(e) => setAttachmentForm({ ...attachmentForm, category: e.target.value })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <Input
                placeholder="File URL / PDF Link"
                value={attachmentForm.fileUrl}
                onChange={(e) => setAttachmentForm({ ...attachmentForm, fileUrl: e.target.value, fileName: e.target.value.split("/").pop() || "doc.pdf" })}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAttachmentModal(false);
                    setEditingAttachment(null);
                  }}
                  className="text-slate-600 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingAttachment) {
                      updateAttachment.mutate({ id: editingAttachment, ...attachmentForm });
                    } else {
                      createAttachment.mutate(attachmentForm);
                    }
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shadow-sm"
                >
                  {editingAttachment ? "Update Attachment" : "Save Attachment"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: BULK TC IMPORT */}
        {bulkTcModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-lg max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold text-slate-900">Bulk Import Transfer Certificates</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-800 mb-1">CSV Format (one student per line):</p>
                <code className="text-[10px] text-blue-700 font-mono block">
                  admissionNumber, studentName, fatherName, motherName, classLeaving, dateOfIssue (YYYY-MM-DD), status (Issued/Pending/Cancelled)
                </code>
                <p className="text-[10px] text-blue-600 mt-1">Example: DPSI-1082, Rahul Sharma, Rajesh Sharma, Priya Sharma, Class X, 2025-04-15, Issued</p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Paste CSV Data</label>
                <Textarea
                  rows={8}
                  placeholder={"DPSI-1001, Rahul Sharma, Rajesh Sharma, Priya Sharma, Class X, 2025-04-15, Issued\nDPSI-1002, Priya Verma, Suresh Verma, Meena Verma, Class XII, 2025-04-20, Issued"}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-300"
                onClick={() => {
                  const rows = parseBulkCsv(bulkCsvText);
                  setBulkPreviewRows(rows);
                  if (rows.length === 0) toast.error("No valid rows found. Check the format.");
                  else toast.info(`Found ${rows.length} valid records. Review below then confirm.`);
                }}
              >
                Parse & Preview ({parseBulkCsv(bulkCsvText).length} rows)
              </Button>

              {bulkPreviewRows.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-auto max-h-52">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Adm No.</th>
                        <th className="px-3 py-2">Student</th>
                        <th className="px-3 py-2">Father</th>
                        <th className="px-3 py-2">Class</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bulkPreviewRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-1.5 font-mono font-bold text-emerald-700">{r.admissionNumber}</td>
                          <td className="px-3 py-1.5">{r.studentName}</td>
                          <td className="px-3 py-1.5 text-slate-500">{r.fatherName}</td>
                          <td className="px-3 py-1.5 text-slate-500">{r.classLeaving}</td>
                          <td className="px-3 py-1.5 text-slate-500">{r.dateOfIssue}</td>
                          <td className="px-3 py-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setBulkTcModal(false); setBulkCsvText(""); setBulkPreviewRows([]); }} className="text-slate-600 text-xs">Cancel</Button>
                <Button
                  disabled={bulkPreviewRows.length === 0 || bulkCreateTc.isPending}
                  onClick={() => bulkCreateTc.mutate({ records: bulkPreviewRows })}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                >
                  {bulkCreateTc.isPending ? "Importing..." : `Import ${bulkPreviewRows.length} Records`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
