import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi, uploadApi } from '../../services/api';
import styles from './SettingsModal.module.scss';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.svg';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setAvatarUrl(user?.avatar_url || null);
      setError(null);
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please select a PNG, JPG, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 2MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Upload the file
      const url = await uploadApi.uploadAvatar(file);
      setAvatarUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build update payload
      const updateData: { name: string; avatar_url?: string } = {
        name: name.trim(),
      };

      // Include avatar_url if it changed
      if (avatarUrl !== user?.avatar_url) {
        updateData.avatar_url = avatarUrl || undefined;
      }

      // Call API and get updated user data
      const updatedUser = await userApi.updateMe(updateData);

      // Update local auth state with response from API
      updateUser(updatedUser);

      handleClose();
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const displayAvatar = avatarUrl || user?.avatar_url || avatarPlaceholder;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Update your profile</h2>
            <p className={styles.subtitle}>Personalize your account with your name and photo.</p>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter your name"
            />
          </div>

          {/* Avatar field */}
          <div className={styles.avatarField}>
            <img 
              src={displayAvatar} 
              alt="Profile" 
              className={styles.avatarPreview}
            />
            <div className={styles.avatarInfo}>
              <span className={styles.avatarLabel}>Upload Image</span>
              <span className={styles.avatarHint}>Max 2MB, PNG or JPG</span>
              <button 
                type="button" 
                className={styles.uploadButton}
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Error message */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit button */}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
