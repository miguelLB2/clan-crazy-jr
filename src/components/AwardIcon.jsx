import React from 'react';
import { Trophy, Flame, Crown, Star, Medal, Target, Shield, Award } from 'lucide-react';

export default function AwardIcon({ name, className = "w-6 h-6" }) {
  switch (name?.toLowerCase()) {
    case 'trophy':
    case 'trofeo':
      return <Trophy className={className} />;
    case 'flame':
    case 'fuego':
      return <Flame className={className} />;
    case 'crown':
    case 'corona':
      return <Crown className={className} />;
    case 'star':
    case 'estrella':
      return <Star className={className} />;
    case 'medal':
    case 'medalla':
      return <Medal className={className} />;
    case 'target':
    case 'diana':
      return <Target className={className} />;
    case 'shield':
    case 'escudo':
      return <Shield className={className} />;
    default:
      return <Award className={className} />;
  }
}
