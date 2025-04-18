'use client';

import { usePathname } from 'next/navigation';
import PersistMenu from '@/ui/PersistMenu';

const ConditionalMenu = () => {
  const path = usePathname();

  const noHeaderPages = ['/']; // add more paths as needed
  const shouldShowHeader = !noHeaderPages.includes(path);

  return shouldShowHeader ? <PersistMenu /> : null;
};

export default ConditionalMenu;
