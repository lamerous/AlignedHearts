import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarImage } from '@/core/ui/avatar';
import { Button } from '@/core/ui/button';

import { useUpdateProfile } from '../hooks/useUpdateProfile';

interface EditableAvatarProps {
  currentAvatar: string | null | undefined;
  size?: 'sm' | 'lg';
}

export const EditableAvatar = ({
  currentAvatar,
  size = 'lg',
}: EditableAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { changeAvatar } = useUpdateProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isLarge = size === 'lg';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        await changeAvatar.mutateAsync(file);
        await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        setPreviewUrl(null);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  return (
    <div className="relative">
      <Avatar
        className={`${isLarge ? 'h-48 w-48 lg:h-56 lg:w-56' : 'h-50 w-50'} border-8 border-white shadow-2xl`}
      >
        <AvatarImage
          src={previewUrl || currentAvatar || undefined}
          className="object-cover"
        />
      </Avatar>

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={changeAvatar.isPending}
        className={`absolute ${isLarge ? 'right-2 bottom-2 h-14 w-14' : 'right-0 bottom-0 h-12 w-12'} cursor-pointer rounded-full bg-[#F61064] text-white shadow-lg ring-4 ring-white transition-transform hover:scale-110 hover:bg-[#F61064] disabled:opacity-50`}
      >
        <Camera size={isLarge ? 26 : 20} className="mx-auto" />
      </Button>

      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};
