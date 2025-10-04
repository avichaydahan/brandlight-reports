import { Header, type HeaderProps } from './header.js';

export interface PageSectionProps {
  children: string;
  showHeader?: boolean;
  pageClass?: 'first-page' | 'subsequent-page';
  headerProps?: HeaderProps;
}

export function PageSection({
  children,
  showHeader = true,
  pageClass = 'subsequent-page',
  headerProps,
}: PageSectionProps): string {
  return `
    <div class="content-page ${pageClass}">
      ${showHeader && headerProps ? Header(headerProps) : ''}
      ${children}
    </div>
  `;
}
