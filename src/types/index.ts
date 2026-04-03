export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  pricePerSqft?: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'sold' | 'pending';
  images: string[];
  enhancedImages?: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  lotSize?: number;
  garage?: number;
  listed: string;
  agent: Agent;
  coordinates?: { lat: number; lng: number };
  isAIEnhanced?: boolean;
  tags?: string[];
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  agency: string;
  rating: number;
  reviews: number;
  sales: number;
}

export interface PhotoEnhancement {
  id: string;
  originalUri: string;
  enhancedUri?: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  improvements: EnhancementImprovement[];
  processingStep?: string;
  progress?: number;
}

export interface EnhancementImprovement {
  type:
    | 'declutter'
    | 'lighting'
    | 'color-grade'
    | 'upscale'
    | 'sharpen'
    | 'noise-reduction'
    | 'exposure';
  label: string;
  applied: boolean;
}

export type RootStackParamList = {
  Main: undefined;
  PropertyDetail: { propertyId: string };
  PhotoEnhancement: { propertyId?: string };
  EnhancementResult: { jobId: string };
  AgentProfile: { agentId: string };
  Search: undefined;
  AddListing: undefined;
};

export type TabParamList = {
  Home: undefined;
  Listings: undefined;
  Enhance: undefined;
  Saved: undefined;
  Profile: undefined;
};
