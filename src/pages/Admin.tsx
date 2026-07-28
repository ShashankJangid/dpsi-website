import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Image,
  MessageSquare,
  GraduationCap,
  Users,
  LogOut,
  Bell,
  Trash2,
  Edit,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "admissions", label: "Admissions", icon: <GraduationCap className="w-5 h-5" /> },
  { id: "news", label: "News", icon: <Newspaper className="w-5 h-5" /> },
  { id: "events", label: "Events", icon: <CalendarDays className="w-5 h-5" /> },
  { id: "gallery", label: "Gallery", icon: <Image className="w-5 h-5" /> },
  { id: "messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
];

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: admissionStats } = trpc.admissions.stats.useQuery();
  const { data: admissions } = trpc.admissions.list.useQuery();
  const { data: newsList } = trpc.news.adminList.useQuery();
  const { data: eventsList } = trpc.events.all.useQuery();
  const { data: galleryList } = trpc.gallery.list.useQuery();
  const { data: messages } = trpc.contact.list.useQuery();

  const utils = trpc.useUtils();
  const deleteNews = trpc.news.delete.useMutation({ onSuccess: () => utils.news.adminList.invalidate() });
  const deleteEvent = trpc.events.delete.useMutation({ onSuccess: () => utils.events.all.invalidate() });
  const deleteGallery = trpc.gallery.delete.useMutation({ onSuccess: () => utils.gallery.list.invalidate() });
  const deleteMessage = trpc.contact.delete.useMutation({ onSuccess: () => utils.contact.list.invalidate() });
  const deleteAdmission = trpc.admissions.delete.useMutation({ onSuccess: () => utils.admissions.list.invalidate() });
  const updateStatus = trpc.admissions.updateStatus.useMutation({ onSuccess: () => utils.admissions.list.invalidate() });
  const markRead = trpc.contact.markRead.useMutation({ onSuccess: () => utils.contact.list.invalidate() });

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 shrink-0">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-1 sticky top-24">
                <div className="px-4 py-3 mb-4 border-b border-border">
                  <h3 className="font-bold text-slate-900 dark:text-white">Admin Panel</h3>
                  <p className="text-xs text-muted-foreground">{user?.name || "Administrator"}</p>
                </div>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border mt-4 pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Exit Admin
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Admissions" value={admissionStats?.total ?? 0} icon={<GraduationCap className="w-5 h-5" />} />
                    <StatCard title="Pending" value={admissionStats?.pending ?? 0} icon={<Bell className="w-5 h-5" />} />
                    <StatCard title="Approved" value={admissionStats?.approved ?? 0} icon={<Users className="w-5 h-5" />} />
                    <StatCard title="Messages" value={messages?.length ?? 0} icon={<MessageSquare className="w-5 h-5" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Admissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {admissions?.slice(0, 5).map((a) => (
                          <div key={a.id} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                              <p className="font-medium text-sm">{a.studentName}</p>
                              <p className="text-xs text-muted-foreground">Class {a.grade} | {a.status}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.status === "approved" ? "bg-green-100 text-green-700" :
                              a.status === "pending" ? "bg-amber-100 text-amber-700" :
                              a.status === "reviewing" ? "bg-blue-100 text-blue-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {a.status}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Unread Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {messages?.filter((m) => !m.read).slice(0, 5).map((m) => (
                          <div key={m.id} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                              <p className="font-medium text-sm">{m.name}</p>
                              <p className="text-xs text-muted-foreground">{m.subject || "No subject"}</p>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => markRead.mutate({ id: m.id })}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {messages?.filter((m) => !m.read).length === 0 && (
                          <p className="text-sm text-muted-foreground py-4 text-center">No unread messages</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "admissions" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Admission Applications</h2>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Grade</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admissions?.map((a) => (
                            <tr key={a.id} className="border-b">
                              <td className="px-4 py-3 text-sm">{a.studentName}<br /><span className="text-xs text-muted-foreground">{a.parentName}</span></td>
                              <td className="px-4 py-3 text-sm">{a.grade}</td>
                              <td className="px-4 py-3 text-sm">{a.phone}<br /><span className="text-xs text-muted-foreground">{a.email}</span></td>
                              <td className="px-4 py-3">
                                <select
                                  value={a.status}
                                  onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value as "pending" | "reviewing" | "approved" | "rejected" })}
                                  className="text-xs px-2 py-1 rounded border"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewing">Reviewing</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => deleteAdmission.mutate({ id: a.id })}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "news" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">News Management</h2>
                    <Button className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Add News</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newsList?.map((n) => (
                      <Card key={n.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{n.title}</h3>
                              <p className="text-xs text-muted-foreground">{n.category} | {new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => deleteNews.mutate({ id: n.id })}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "events" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Events Management</h2>
                    <Button className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
                  </div>
                  <div className="space-y-3">
                    {eventsList?.map((e) => (
                      <Card key={e.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{e.title}</h3>
                            <p className="text-xs text-muted-foreground">{new Date(e.eventDate).toLocaleDateString()} | {e.location}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => deleteEvent.mutate({ id: e.id })}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Gallery Management</h2>
                    <Button className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryList?.map((g) => (
                      <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square">
                        <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-sm font-medium">{g.title}</p>
                        </div>
                        <button onClick={() => deleteGallery.mutate({ id: g.id })} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "messages" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
                  <div className="space-y-3">
                    {messages?.map((m) => (
                      <Card key={m.id} className={m.read ? "opacity-70" : "border-l-4 border-l-emerald-500"}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{m.name}</h3>
                                {!m.read && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">New</span>}
                              </div>
                              <p className="text-xs text-muted-foreground">{m.email} | {m.phone}</p>
                              <p className="text-sm font-medium mt-1">{m.subject || "No subject"}</p>
                              <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
                            </div>
                            <div className="flex gap-1">
                              {!m.read && (
                                <Button size="sm" variant="ghost" onClick={() => markRead.mutate({ id: m.id })}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => deleteMessage.mutate({ id: m.id })}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}