"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, FileText, Upload, RefreshCw } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from "@/components/ui";
import { compressAndUploadImage } from "@/lib/client-upload";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const res = await compressAndUploadImage(file, "blog");
      setCoverUrl(res.url);
    } catch (err) {
      alert((err as Error).message || "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          coverImage: coverUrl || null,
          published,
        }),
      });

      if (res.ok) {
        setTitle("");
        setExcerpt("");
        setContent("");
        setCoverUrl("");
        setPublished(false);
        await fetchPosts();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this blog article?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Blog & Technical Articles
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Optional automotive maintenance guides, brake troubleshooting, and OEM part comparisons
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchPosts}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Post Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-amber" />
                <span>Write New Article</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-3.5">
                <Input
                  label="Article Title *"
                  placeholder="e.g. When to Replace Ceramic Brake Pads"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs"
                  required
                />

                <Input
                  label="Short Excerpt"
                  placeholder="Summary for homepage preview"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="text-xs"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-brand-zinc-300">
                    Cover Banner (Vercel Blob)
                  </label>
                  <div className="flex items-center gap-3">
                    {coverUrl ? (
                      <div className="w-14 h-10 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 overflow-hidden shrink-0">
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-brand-zinc-800 border border-dashed border-brand-zinc-700 flex items-center justify-center text-brand-zinc-500 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCoverUpload}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      loading={uploadingCover}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      {coverUrl ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-brand-zinc-300">
                    Article Content *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write detailed maintenance guides and advice..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-brand-zinc-800 border border-brand-zinc-700 text-brand-white placeholder-brand-zinc-500 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-amber focus:outline-none"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-brand-zinc-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                  />
                  <span>Publish immediately to store</span>
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  size="md"
                  loading={isSubmitting}
                >
                  Save Article
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Published & Draft Articles ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Spinner size="lg" color="amber" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-xs text-brand-zinc-500">
                  No blog articles written yet. (Rule 3: Homepage blog section is automatically hidden when empty).
                </div>
              ) : (
                <div className="divide-y divide-brand-zinc-800">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="py-3.5 flex items-start justify-between gap-4 hover:bg-brand-zinc-800/20 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {post.coverImage && (
                          <div className="w-16 h-12 rounded-lg bg-brand-zinc-800 overflow-hidden shrink-0 border border-brand-zinc-700">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-brand-white">{post.title}</div>
                          {post.excerpt && (
                            <p className="text-xs text-brand-zinc-400 mt-0.5 line-clamp-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-zinc-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge size="sm" variant={post.published ? "green" : "zinc"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-brand-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
