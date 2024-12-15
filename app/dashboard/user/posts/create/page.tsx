'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircleIcon } from 'lucide-react';

const postSchema = z.object({
  images: z.array(z.instanceof(File)).nonempty('At least one image is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).nonempty('At least one tag is required'),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePostPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      images: [],
      description: '',
      tags: [],
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      data?.images?.forEach((image: any) => formData.append('images', image));
      formData.append('description', data?.description);
      formData.append('tags', JSON.stringify(data?.tags));

      const response = await api.post(`/api/users/${session?.user?.id}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.success) {
        toast.success('Post created successfully!');
        reset();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input
                type="file"
                multiple
                {...register('images')}
                accept="image/*"
              />
              {errors?.images && (
                <p className="text-red-500 text-sm">{errors?.images?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Describe your post"
              />
              {errors?.description && (
                <p className="text-red-500 text-sm">{errors?.description?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <Select
                    value={field?.value}
                    onValueChange={(value: any) => field?.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.tags && (
                <p className="text-red-500 text-sm">{errors?.tags?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostPage;