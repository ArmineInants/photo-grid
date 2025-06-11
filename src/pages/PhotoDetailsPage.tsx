import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { usePhotoDetails } from "../hooks/usePhotoDetails";
import { ErrorState } from "../components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const PageContainer = styled.div`
  max-width: ${props => props.theme.container.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const PhotoContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const ImageWrapper = styled.div<{ $aspectratio: number }>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => (1 / props.$aspectratio) * 100}%;
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.radius.lg};
  overflow: hidden;
`;

const PhotoImage = styled.img<{ $isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const PhotoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PhotographerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
`;

const BackButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.text};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    opacity: 0.9;
  }
`;

const Placeholder = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.grayLight} 25%,
    ${props => props.theme.colors.gray} 50%,
    ${props => props.theme.colors.grayLight} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.theme.radius.lg};
`;

const ImagePlaceholder = styled(Placeholder)`
  width: 100%;
  padding-bottom: 75%; /* Default aspect ratio */
`;

const TitlePlaceholder = styled(Placeholder)`
  width: 70%;
  height: 2rem;
  margin: 0;
`;

const DescriptionPlaceholder = styled(Placeholder)`
  width: 100%;
  height: 1.1rem;
  margin: 0.5rem 0;
`;

const PhotographerPlaceholder = styled(Placeholder)`
  width: 40%;
  height: 1.5rem;
  margin-top: ${props => props.theme.spacing.sm};
`;

const PhotoDetailsPlaceholder = () => (
  <PageContainer>
    <BackButton disabled>← Back to Gallery</BackButton>
    <PhotoContainer>
      <ImagePlaceholder />
      <PhotoInfo>
        <TitlePlaceholder />
        <DescriptionPlaceholder />
        <DescriptionPlaceholder />
        <PhotographerPlaceholder />
      </PhotoInfo>
    </PhotoContainer>
  </PageContainer>
);

export const PhotoDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photo, loading = true, error } = usePhotoDetails(Number(id));
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <PhotoDetailsPlaceholder />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!photo) {
    return <ErrorState message="Photo not found" onRetry={handleBack} />;
  }

  // Calculate aspect ratio
  const aspectratio = photo.width / photo.height;

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>← Back to Gallery</BackButton>
      <PhotoContainer>
        <ImageWrapper $aspectratio={aspectratio}>
          <PhotoImage 
            src={photo.src.large2x}
            srcSet={`${photo.src.tiny} 100w, ${photo.src.small} 300w, ${photo.src.medium} 600w, ${photo.src.large} 1200w`}
            sizes="(max-width: 300px) 100px, (max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
            alt={photo.alt || 'Photo'}
            loading="eager"
            decoding="sync"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            width={photo.width}
            height={photo.height}
            $isLoaded={imageLoaded}
            onLoad={() => setImageLoaded(true)}
          />
        </ImageWrapper>
        <PhotoInfo>
          <Title>{photo.alt || 'Untitled'}</Title>
          <Description>{photo.alt}</Description>
          <PhotographerInfo>
            <span>Photo by</span>
            <strong>{photo.photographer}</strong>
          </PhotographerInfo>
        </PhotoInfo>
      </PhotoContainer>
    </PageContainer>
  );
};
