import { Header } from './header.js';
export function PageSection({ children, showHeader = true, pageClass = 'subsequent-page', headerProps, }) {
    return `
    <div class="content-page ${pageClass}">
      ${showHeader && headerProps ? Header(headerProps) : ''}
      ${children}
    </div>
  `;
}
