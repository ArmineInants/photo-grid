import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePhotoDetails } from "../hooks/usePhotoDetails";
import { ErrorState } from "../components";
import { PhotoCard } from "../components/PhotoCard/PhotoCard";

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

const PhotographerLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    opacity: 0.9;
  }
`;

export const PhotoDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photo, loading = true, error } = usePhotoDetails(Number(id));
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <PageContainer>
        <BackButton disabled>← Back to Gallery</BackButton>
        <PhotoContainer>
          <PhotoInfo>
            <Title>Loading...</Title>
            <Description>Please wait while we load the photo details.</Description>
          </PhotoInfo>
        </PhotoContainer>
      </PageContainer>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!photo) {
    return <ErrorState message="Photo not found" onRetry={handleBack} />;
  }

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>← Back to Gallery</BackButton>
      <PhotoContainer>
        <PhotoCard
          photo={photo}
          variant="detail"
          priority={true}
          isLoaded={imageLoaded}
          onImageLoad={() => setImageLoaded(true)}
        />
        <PhotoInfo>
          <Title>{photo.alt || 'Untitled'}</Title>
          <Description>{photo.alt}</Description>
          <PhotographerInfo>
            <span>Photo by</span>
            <PhotographerLink 
              href={photo.photographer_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {photo.photographer}
            </PhotographerLink>
          </PhotographerInfo>
        </PhotoInfo>
      </PhotoContainer>
    </PageContainer>
  );
};
