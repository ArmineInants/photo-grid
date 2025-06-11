import { memo } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';

interface PhotoCardProps {
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
  onImageLoad?: (photoId: number) => void;
  isLoaded?: boolean;
  showPlaceholder?: boolean;
  variant?: 'grid' | 'detail';
  priority?: boolean;
}

const PhotoCardWrapper = styled.div<{ 
  $aspectRatio: number;
  $variant: 'grid' | 'detail';
}>`
  position: relative;
  width: 100%;
  cursor: ${props => props.$variant === 'grid' ? 'pointer' : 'default'};
  transition: transform 0.2s ease-in-out;
  padding-bottom: ${props => (1 / props.$aspectRatio) * 100}%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  border-radius: ${props => props.theme.radius.md};

  ${props => props.$variant === 'grid' && `
    &:hover {
      transform: scale(1.02);
    }
  `}
`;

const PhotoImage = styled.img<{ 
  $isLoaded: boolean;
  $variant: 'grid' | 'detail';
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${props => props.theme.radius.md};
  opacity: ${props => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  will-change: opacity;
  transform: translateZ(0);
`;

const PhotoPlaceholder = styled.div<{ 
  $aspectRatio: number;
  $variant: 'grid' | 'detail';
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.background} 25%, 
    ${props => props.theme.colors.gray} 50%, 
    ${props => props.theme.colors.background} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: ${props => props.theme.radius.md};
  aspect-ratio: ${props => props.$aspectRatio};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const PhotoCard = memo<PhotoCardProps>(
  ({ 
    photo, 
    onPhotoClick, 
    onImageLoad, 
    isLoaded = false, 
    showPlaceholder = false,
    variant = 'grid',
    priority = false
  }) => {
    // Calculate appropriate image size based on variant and width
    const getImageSize = (width: number) => {
      if (variant === 'detail') {
        if (width <= 600) return 'medium';
        if (width <= 1200) return 'large';
        return 'large2x';
      }
      
      if (width <= 300) return 'tiny';
      if (width <= 600) return 'small';
      if (width <= 1200) return 'medium';
      return 'large';
    };

    // Calculate the actual display width based on aspect ratio
    const displayWidth = Math.min(
      photo.width, 
      variant === 'detail' ? 1200 : 800
    );
    const displayHeight = Math.round(displayWidth / (photo.width / photo.height));

    return (
      <PhotoCardWrapper
        onClick={() => onPhotoClick?.(photo)}
        $aspectRatio={photo.width / photo.height}
        $variant={variant}
      >
        <PhotoPlaceholder 
          $aspectRatio={photo.width / photo.height}
          $variant={variant}
        />
        {!showPlaceholder && (
          <PhotoImage
            src={photo.src[getImageSize(displayWidth)]}
            srcSet={`
              ${photo.src.tiny} 300w,
              ${photo.src.small} 600w,
              ${photo.src.medium} 900w,
              ${photo.src.large} 1200w,
              ${photo.src.large2x} 1800w
            `}
            sizes={variant === 'detail' 
              ? "(max-width: 600px) 600px, (max-width: 1200px) 1200px, 1800px"
              : "(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 900px) 900px, 1200px"
            }
            alt={photo.alt || 'Photo'}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            width={displayWidth}
            height={displayHeight}
            $isLoaded={isLoaded}
            $variant={variant}
            onLoad={() => onImageLoad?.(photo.id)}
          />
        )}
      </PhotoCardWrapper>
    );
  }
);

PhotoCard.displayName = 'PhotoCard';
