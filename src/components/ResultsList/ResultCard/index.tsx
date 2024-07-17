import React from 'react';
import './styles.css';
import { Actress } from '../../types';

interface ResultCardProps {
  actress: Actress;
  handleCardClick: (actress: Actress) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  actress,
  handleCardClick,
}) => {
  return (
    <div
      className="card result-card"
      role="listitem"
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick(actress);
      }}
    >
      <div className="content">
        <img className="result-image" src={actress.image} alt="photo" />
        <h2>{actress.name}</h2>
        <p>Birth Year: {actress.birth_year}</p>
        <p>Nationality: {actress.nationality}</p>
      </div>
    </div>
  );
};

export default ResultCard;
