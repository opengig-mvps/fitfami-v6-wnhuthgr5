"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircleIcon, Heart, MessageSquare, Share } from "lucide-react";
import api from "@/lib/api";

const profileSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  profilePicture: z.string().url("Please enter a valid URL"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/${session?.user?.id}/profile`);
      const { data } = res?.data;
      setPosts(data?.posts);
      setFollowerCount(data?.followerCount);
      setIsFollowing(data?.isFollowing);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session?.user?.id]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const payload = {
        bio: data?.bio,
        profilePicture: data?.profilePicture,
      };

      const response = await api.put(
        `/api/users/${session?.user?.id}/profile`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleFollowToggle = async () => {
    try {
      const response = await api.post(`/api/users/${session?.user?.id}/follow`);
      if (response?.data?.success) {
        setIsFollowing((prev) => !prev);
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
        toast.success(
          isFollowing ? "Unfollowed successfully!" : "Followed successfully!"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Profile Page</h2>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={session?.user?.image ?? "/placeholder.png"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                Followers: {followerCount}
              </p>
              <Button variant="outline" onClick={handleFollowToggle}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                {...register("bio")}
                placeholder="Write your bio here..."
              />
              {errors?.bio && (
                <p className="text-red-500 text-sm">{errors?.bio?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture URL</Label>
              <Input
                {...register("profilePicture")}
                placeholder="Enter profile picture URL"
              />
              {errors?.profilePicture && (
                <p className="text-red-500 text-sm">
                  {errors?.profilePicture?.message}
                </p>
              )}
            </div>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-bold mt-8 mb-6">Your Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          posts?.map((post: any) => (
            <Card key={post?.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={session?.user?.image ?? "/placeholder.png"} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {post?.createdAt}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={post?.image ?? "/placeholder.png"}
                  alt={`Post ${post?.id}`}
                  className="w-full h-auto aspect-square object-cover"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4 w-full">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{session?.user?.name}</span>{" "}
                    {post?.caption}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    View all {post?.comments?.length} comments
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;