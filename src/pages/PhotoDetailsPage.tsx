import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { usePhotoDetails } from "../hooks/usePhotoDetails";
import { ErrorState } from "../components/ErrorState";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const PhotoContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${props => props.theme.radius.lg};
  object-fit: cover;
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
  aspect-ratio: 16/9;
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

  const handleBack = () => {
    navigate(-1);
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

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>← Back to Gallery</BackButton>
      <PhotoContainer>
        <PhotoImage 
          src={photo.src.large2x} 
          alt={photo.alt || 'Photo'} 
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
