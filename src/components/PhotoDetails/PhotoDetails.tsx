import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';

interface PhotoDetailsProps {
  photo: Photo;
}

const DetailsContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      <h1>{photo.alt || 'Untitled'}</h1>
      <img
        src={photo.src.large}
        srcSet={`${photo.src.small} 300w, ${photo.src.medium} 600w, ${photo.src.large} 1200w`}
        sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
        alt={photo.alt || 'Photo'}
        loading="lazy"
      />
      <div>
        <p>Photographer: {photo.photographer}</p>
        {/* <p>Date: {new Date(photo.created_at).toLocaleDateString()}</p> */}
      </div>
    </DetailsContainer>
  );
}; 