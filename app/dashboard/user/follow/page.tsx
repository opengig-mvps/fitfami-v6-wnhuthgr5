"use client";
import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { LoaderCircleIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const FollowPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users?page=${page}`);
      setUsers(res?.data?.data);
      setTotalPages(res?.data?.totalPages);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const res = await axios.post(`/api/users/${session?.user?.id}/follow`, { userId });
      if (res?.data?.success) {
        toast.success("Followed successfully!");
        fetchUsers(currentPage);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const res = await axios.post(`/api/users/${session?.user?.id}/unfollow`, { userId });
      if (res?.data?.success) {
        toast.success("Unfollowed successfully!");
        fetchUsers(currentPage);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="container px-4 md:px-6 py-6">
          <h2 className="text-2xl font-bold mb-6">Follow Users</h2>
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center">
                <LoaderCircleIcon className="animate-spin h-8 w-8" />
              </div>
            ) : (
              users?.map((user: any) => (
                <Card key={user?.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user?.image || "/placeholder-user.jpg"} alt={`User ${user?.name}`} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-sm font-medium">{user?.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{user?.bio}</p>
                  </CardContent>
                  <CardFooter>
                    {user?.isFollowing ? (
                      <Button variant="outline" onClick={() => handleUnfollow(user?.id)}>
                        Unfollow
                      </Button>
                    ) : (
                      <Button onClick={() => handleFollow(user?.id)}>Follow</Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </main>
    </div>
  );
};

export default FollowPage;