/**
 * Data Validation Utilities
 *
 * These utilities help validate data structures before passing to components,
 * ensuring production-ready error handling and helpful error messages.
 */

import { CategoryData } from '../components/donutChart.js';
import { DomainData as BarChartDomainData } from '../components/barChart.js';
import { DomainData as DomainListData } from '../components/dataTable.js';
import { SummaryCardProps } from '../components/summaryCards.js';

/**
 * Validates DonutChart data structure
 */
export function validateDonutChartData(data: unknown): CategoryData[] {
  if (!Array.isArray(data)) {
    throw new Error('DonutChart data must be an array');
  }

  if (data.length === 0) {
    throw new Error('DonutChart data cannot be empty');
  }

  return data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(
        `DonutChart data item at index ${index} must be an object`
      );
    }

    const categoryData = item as CategoryData;

    if (typeof categoryData.category !== 'string') {
      throw new Error(
        `DonutChart data item at index ${index} missing 'category' string property`
      );
    }

    if (typeof categoryData.percentage !== 'number') {
      throw new Error(
        `DonutChart data item at index ${index} missing 'percentage' number property`
      );
    }

    if (typeof categoryData.domains !== 'string') {
      throw new Error(
        `DonutChart data item at index ${index} missing 'domains' string property`
      );
    }

    if (
      typeof categoryData.color !== 'string' ||
      !categoryData.color.match(/^#[0-9A-Fa-f]{6}$/)
    ) {
      throw new Error(
        `DonutChart data item at index ${index} must have valid 'color' hex string (e.g., #3A5AFE)`
      );
    }

    return categoryData;
  });
}

/**
 * Validates BarChart data structure
 */
export function validateBarChartData(data: unknown): BarChartDomainData[] {
  if (!Array.isArray(data)) {
    throw new Error('BarChart data must be an array');
  }

  if (data.length === 0) {
    throw new Error('BarChart data cannot be empty');
  }

  return data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`BarChart data item at index ${index} must be an object`);
    }

    const domainData = item as BarChartDomainData;

    if (typeof domainData.name !== 'string') {
      throw new Error(
        `BarChart data item at index ${index} missing 'name' string property`
      );
    }

    if (typeof domainData.value !== 'number') {
      throw new Error(
        `BarChart data item at index ${index} missing 'value' number property`
      );
    }

    if (typeof domainData.icon !== 'string') {
      throw new Error(
        `BarChart data item at index ${index} missing 'icon' string property`
      );
    }

    return domainData;
  });
}

/**
 * Validates DomainList data structure
 */
export function validateDomainListData(params: {
  data: unknown;
  totalCount: unknown;
}): { data: DomainListData[]; totalCount: number } {
  // Validate totalCount
  if (typeof params.totalCount !== 'number') {
    throw new Error('DomainList totalCount must be a number');
  }

  if (params.totalCount < 0) {
    throw new Error('DomainList totalCount cannot be negative');
  }

  // Validate data array
  if (!Array.isArray(params.data)) {
    throw new Error('DomainList data must be an array');
  }

  if (params.data.length === 0) {
    throw new Error('DomainList data cannot be empty');
  }

  const validatedData = params.data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(
        `DomainList data item at index ${index} must be an object`
      );
    }

    const domainData = item as DomainListData;

    // Required string fields
    const requiredStringFields = [
      'name',
      'citationFrequency',
      'monthlyVisits',
      'domainType',
      'categories',
    ];
    for (const field of requiredStringFields) {
      if (typeof (domainData as any)[field] !== 'string') {
        throw new Error(
          `DomainList data item at index ${index} missing '${field}' string property`
        );
      }
    }

    // Required number fields
    const requiredNumberFields = [
      'influenceScore',
      'change',
      'citationsToVisits',
      'brandMentions',
      'competitorMentions',
    ];
    for (const field of requiredNumberFields) {
      if (typeof (domainData as any)[field] !== 'number') {
        throw new Error(
          `DomainList data item at index ${index} missing '${field}' number property`
        );
      }
    }

    return domainData;
  });

  return {
    data: validatedData,
    totalCount: params.totalCount,
  };
}

/**
 * Validates SummaryCards data structure
 */
export function validateSummaryCardsData(data: unknown): SummaryCardProps[] {
  if (!Array.isArray(data)) {
    throw new Error('SummaryCards data must be an array');
  }

  if (data.length === 0) {
    throw new Error('SummaryCards data cannot be empty');
  }

  return data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(
        `SummaryCards data item at index ${index} must be an object`
      );
    }

    const cardData = item as SummaryCardProps;

    if (typeof cardData.label !== 'string') {
      throw new Error(
        `SummaryCards data item at index ${index} missing 'label' string property`
      );
    }

    if (
      typeof cardData.value !== 'string' &&
      typeof cardData.value !== 'number'
    ) {
      throw new Error(
        `SummaryCards data item at index ${index} 'value' must be string or number`
      );
    }

    // Optional fields validation
    if (cardData.domain !== undefined && typeof cardData.domain !== 'string') {
      throw new Error(
        `SummaryCards data item at index ${index} 'domain' must be string if provided`
      );
    }

    if (
      cardData.favicon !== undefined &&
      typeof cardData.favicon !== 'string'
    ) {
      throw new Error(
        `SummaryCards data item at index ${index} 'favicon' must be string if provided`
      );
    }

    return cardData;
  });
}

/**
 * Validates complete Partnership Report data structure
 */
export function validatePartnershipReportData(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Partnership report data must be an object');
  }

  // Required string fields
  if (typeof data.timeperiod !== 'string') {
    throw new Error(
      "Partnership report data missing 'timeperiod' string property"
    );
  }

  if (typeof data.category !== 'string') {
    throw new Error(
      "Partnership report data missing 'category' string property"
    );
  }

  // Required array fields
  if (!Array.isArray(data.engines)) {
    throw new Error("Partnership report data 'engines' must be an array");
  }

  if (!Array.isArray(data.domains)) {
    throw new Error("Partnership report data 'domains' must be an array");
  }

  if (data.domains.length === 0) {
    throw new Error("Partnership report data 'domains' cannot be empty");
  }

  // Validate summary object
  if (!data.summary || typeof data.summary !== 'object') {
    throw new Error("Partnership report data missing 'summary' object");
  }

  if (typeof data.summary.totalDomainsAnalyzed !== 'number') {
    throw new Error(
      "Partnership report summary missing 'totalDomainsAnalyzed' number property"
    );
  }

  // Validate influenceByDomainType object
  if (
    !data.influenceByDomainType ||
    typeof data.influenceByDomainType !== 'object'
  ) {
    throw new Error(
      "Partnership report data missing 'influenceByDomainType' object"
    );
  }

  for (const [category, value] of Object.entries(data.influenceByDomainType)) {
    if (!value || typeof value !== 'object') {
      throw new Error(
        `Partnership report influenceByDomainType['${category}'] must be an object`
      );
    }

    const typedValue = value as any;
    if (typeof typedValue.percentage !== 'number') {
      throw new Error(
        `Partnership report influenceByDomainType['${category}'] missing 'percentage' number`
      );
    }

    if (typeof typedValue.domains !== 'number') {
      throw new Error(
        `Partnership report influenceByDomainType['${category}'] missing 'domains' number`
      );
    }
  }
}

/**
 * Safe wrapper for validation with better error messages
 */
export function validateDataSafely<T>(
  validationFn: () => T,
  componentName: string,
  context?: string
): T {
  try {
    return validationFn();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const contextMessage = context ? ` (Context: ${context})` : '';
    throw new Error(
      `${componentName} validation failed${contextMessage}: ${errorMessage}`
    );
  }
}
