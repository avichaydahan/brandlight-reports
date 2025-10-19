/**
 * Top Cited Content Table component
 * Displays ranked URLs with mentions, brand mention status, sentiment, and percentage
 */

export interface TopCitedContentRow {
  rank: number;
  url: string;
  mentions: number;
  brandMentioned: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  percentage: number;
}

export interface TopCitedContentTableData {
  title: string;
  rows: TopCitedContentRow[];
}

/**
 * Get sentiment icon SVG
 */
function getSentimentIcon(
  sentiment: 'positive' | 'neutral' | 'negative'
): string {
  const icons = {
    positive: `
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px; position: relative;"
        preserveAspectRatio="none"
      >
        <mask
          id="mask0_positive"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 0H15.9997V16H0V0Z"
            fill="white"
          ></path>
        </mask>
        <g mask="url(#mask0_positive)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0"
            fill="#06D6A0"
          ></path>
        </g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.0968 8.63739C10.0968 9.45005 9.13681 10.1367 8.00014 10.1367C6.86347 10.1367 5.90347 9.45005 5.90347 8.63739C5.90347 8.36739 5.68414 8.14805 5.41414 8.14805C5.14414 8.14805 4.9248 8.36739 4.9248 8.63739C4.9248 10.0174 6.30414 11.1394 8.00014 11.1394C9.69614 11.1394 11.0748 10.0174 11.0748 8.63739C11.0775 8.36405 10.8595 8.14005 10.5861 8.13672C10.3128 8.14005 10.0941 8.36405 10.0968 8.63739"
          fill="#002400"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.5 6.58691C11.0527 6.58691 11.5 6.13958 11.5 5.58691C11.5 5.03491 11.0527 4.58691 10.5 4.58691C9.94733 4.58691 9.5 5.03491 9.5 5.58691C9.5 6.13958 9.94733 6.58691 10.5 6.58691"
          fill="#002400"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.5 6.58691C6.05267 6.58691 6.5 6.13958 6.5 5.58691C6.5 5.03491 6.05267 4.58691 5.5 4.58691C4.94733 4.58691 4.5 5.03491 4.5 5.58691C4.5 6.13958 4.94733 6.58691 5.5 6.58691"
          fill="#002400"
        ></path>
      </svg>
    `,
    neutral: `
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px; position: relative;"
        preserveAspectRatio="none"
      >
        <mask
          id="mask0_neutral"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 0H15.9997V16H0V0Z"
            fill="white"
          ></path>
        </mask>
        <g mask="url(#mask0_neutral)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0"
            fill="#D6D9E3"
          ></path>
          <path
            d="M11 9.14697C11.276 9.14697 11.5 9.37031 11.5 9.64697C11.5 9.92295 11.276 10.147 11 10.147H5C4.72401 10.147 4.50002 9.92295 4.5 9.64697C4.5 9.37031 4.724 9.14697 5 9.14697H11ZM5.5 4.5874C6.05267 4.5874 6.5 5.0354 6.5 5.5874C6.5 6.14007 6.05267 6.5874 5.5 6.5874C4.94733 6.5874 4.5 6.14007 4.5 5.5874C4.5 5.0354 4.94733 4.5874 5.5 4.5874ZM10.5 4.5874C11.0527 4.5874 11.5 5.0354 11.5 5.5874C11.5 6.14005 11.0527 6.5874 10.5 6.5874C9.94735 6.5874 9.50002 6.14005 9.5 5.5874C9.5 5.0354 9.94733 4.5874 10.5 4.5874Z"
            fill="#1A1D2A"
          ></path>
        </g>
      </svg>
    `,
    negative: `
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px; position: relative;"
        preserveAspectRatio="none"
      >
        <mask
          id="mask0_negative"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 0H15.9997V16H0V0Z"
            fill="white"
          ></path>
        </mask>
        <g mask="url(#mask0_negative)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0"
            fill="#FF6B6B"
          ></path>
        </g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.0968 7.36261C10.0968 6.54995 9.13681 5.86328 8.00014 5.86328C6.86347 5.86328 5.90347 6.54995 5.90347 7.36261C5.90347 7.63261 5.68414 7.85195 5.41414 7.85195C5.14414 7.85195 4.9248 7.63261 4.9248 7.36261C4.9248 5.98261 6.30414 4.86061 8.00014 4.86061C9.69614 4.86061 11.0748 5.98261 11.0748 7.36261C11.0775 7.63595 10.8595 7.85995 10.5861 7.86328C10.3128 7.85995 10.0941 7.63595 10.0968 7.36261"
          fill="#400000"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.5 9.41309C11.0527 9.41309 11.5 9.86042 11.5 10.4131C11.5 10.9651 11.0527 11.4131 10.5 11.4131C9.94733 11.4131 9.5 10.9651 9.5 10.4131C9.5 9.86042 9.94733 9.41309 10.5 9.41309"
          fill="#400000"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.5 9.41309C6.05267 9.41309 6.5 9.86042 6.5 10.4131C6.5 10.9651 6.05267 11.4131 5.5 11.4131C4.94733 11.4131 4.5 10.9651 4.5 10.4131C4.5 9.86042 4.94733 9.41309 5.5 9.41309"
          fill="#400000"
        ></path>
      </svg>
    `,
  };

  return icons[sentiment];
}

/**
 * Get sentiment text color
 */
function getSentimentColor(
  sentiment: 'positive' | 'neutral' | 'negative'
): string {
  const colors = {
    positive: '#00bc86',
    neutral: '#666976',
    negative: '#ff6b6b',
  };

  return colors[sentiment];
}

export function generateTopCitedContentTable(
  data: TopCitedContentTableData
): string {
  const tableRows = data.rows
    .map(
      (row) => `
    <tr style="border-bottom: 1px solid #ebecf1;">
      <td style="padding: 8px 24px; font-size: 12px; font-weight: 600; text-align: center; color: #0c1233; border-right: 1px solid #ebecf1; white-space: nowrap;">
        ${row.rank}
      </td>
      <td style="padding: 8px 24px; font-size: 12px; font-weight: 500; text-align: left; color: #0c1233; border-right: 1px solid #ebecf1; max-width: 226px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${row.url}
      </td>
      <td style="padding: 8px; font-size: 12px; text-align: right; color: #333643; border-right: 1px solid #ebecf1; white-space: nowrap;">
        ${row.mentions.toLocaleString()}
      </td>
      <td style="padding: 8px; font-size: 12px; text-align: center; color: #333643; border-right: 1px solid #ebecf1; white-space: nowrap;">
        ${row.brandMentioned ? 'Yes' : 'No'}
      </td>
      <td style="padding: 8px; font-size: 12px; text-align: left; color: #333643; border-right: 1px solid #ebecf1; white-space: nowrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${getSentimentIcon(row.sentiment)}
          <span>${
            row.sentiment.charAt(0).toUpperCase() + row.sentiment.slice(1)
          }</span>
        </div>
      </td>
      <td style="padding: 8px 16px; font-size: 12px; font-weight: 500; text-align: center; color: ${getSentimentColor(
        row.sentiment
      )}; white-space: nowrap;">
        ${row.percentage.toFixed(1)}%
      </td>
    </tr>
  `
    )
    .join('\n');

  return `
    <div style="width: 100%; page-break-inside: avoid; margin-bottom: 32px;">
      <p style="font-size: 14px; font-weight: 600; text-align: left; color: #333643; margin-bottom: 8px;">
        ${data.title}
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #ebecf1; border-radius: 10px; overflow: hidden;">
        <thead>
          <tr style="background: #fff; border-bottom: 1px solid #ebecf1;">
            <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: center; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
              #
            </th>
            <th style="padding: 10px 8px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
              URL
            </th>
            <th style="padding: 10px 8px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
              # of mentions
            </th>
            <th style="padding: 10px 8px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
              Brand mentioned
            </th>
            <th style="padding: 10px 8px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
              Sentiment
            </th>
            <th style="padding: 10px 8px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; white-space: nowrap;">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
}
