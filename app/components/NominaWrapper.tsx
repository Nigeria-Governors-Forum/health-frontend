'use client';

import dynamic from 'next/dynamic';
import { NominatimMapProps } from './NomatinMap';

const NominatimMap = dynamic(() =>
  import('./NomatinMap').then((mod) => mod.NominatimMap),
  { ssr: false }
) as React.ComponentType<NominatimMapProps>;

export default NominatimMap;
