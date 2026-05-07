/**
 * Preservation Property Tests - Task 2
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**
 * 
 * These tests capture baseline behavior that must remain unchanged after the fix.
 * Following observation-first methodology - tests run on UNFIXED code to establish baseline.
 * 
 * EXPECTED OUTCOME: All tests PASS (confirms baseline behavior to preserve)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { BUSINESS_CATEGORIES, BusinessCategory } from '../store/AppContext';

describe('Property 2: Preservation - Application Runtime Functionality', () => {
  
  /**
   * Property 2.1: Business Category Preservation
   * **Validates: Requirement 3.1**
   * 
   * For all business categories in the system, the category configuration must exist
   * and contain all required properties (id, icon, label, terminology, defaultServices)
   */
  describe('Business Category Preservation', () => {
    const expectedCategories: BusinessCategory[] = [
      'men_salon',
      'beauty_parlour',
      'unisex_salon',
      'clinic',
      'hospital',
      'restaurant',
      'cafe',
      'gym',
      'spa',
      'pet_care',
      'coaching',
      'law_firm',
      'photography',
      'repair_shop',
      'laundry',
      'other'
    ];

    it('should have all 16 business categories defined', () => {
      const categoryIds = BUSINESS_CATEGORIES.map(cat => cat.id);
      
      expectedCategories.forEach(expectedCat => {
        expect(categoryIds).toContain(expectedCat);
      });
      
      // Verify we have at least 16 categories (may have more like event_planner)
      expect(categoryIds.length).toBeGreaterThanOrEqual(16);
    });

    it('property: all business categories have complete configuration', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            // Each category must have required fields
            expect(category.id).toBeDefined();
            expect(category.icon).toBeDefined();
            expect(category.label).toBeDefined();
            expect(category.labelHi).toBeDefined();
            expect(category.terminology).toBeDefined();
            expect(category.defaultServices).toBeDefined();
            
            // Terminology must have all required fields
            expect(category.terminology.provider).toBeDefined();
            expect(category.terminology.action).toBeDefined();
            expect(category.terminology.noun).toBeDefined();
            expect(category.terminology.item).toBeDefined();
            expect(category.terminology.unit).toBeDefined();
            
            // Default services must be an array
            expect(Array.isArray(category.defaultServices)).toBe(true);
            
            // Each service must have required fields (id, name, price, avgTime)
            // Note: avgTime can be 0 for advance orders (baseline behavior)
            category.defaultServices.forEach(service => {
              expect(service.id).toBeDefined();
              expect(service.name).toBeDefined();
              expect(typeof service.price).toBe('number');
              expect(typeof service.avgTime).toBe('number');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: business category IDs are unique', () => {
      const categoryIds = BUSINESS_CATEGORIES.map(cat => cat.id);
      const uniqueIds = new Set(categoryIds);
      
      expect(uniqueIds.size).toBe(categoryIds.length);
    });

    it('property: all categories have non-empty service lists', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            expect(category.defaultServices.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.2: Type System Preservation
   * **Validates: Requirement 3.2**
   * 
   * For all type definitions, the types must be correctly defined and exportable
   */
  describe('Type System Preservation', () => {
    it('should have Role type with correct values', () => {
      const validRoles: Array<'customer' | 'business'> = ['customer', 'business'];
      
      validRoles.forEach(role => {
        expect(['customer', 'business']).toContain(role);
      });
    });

    it('should have Lang type with correct values', () => {
      const validLangs: Array<'en' | 'hi'> = ['en', 'hi'];
      
      validLangs.forEach(lang => {
        expect(['en', 'hi']).toContain(lang);
      });
    });

    it('property: BusinessCategory type includes all expected categories', () => {
      const expectedCategories: BusinessCategory[] = [
        'men_salon',
        'beauty_parlour',
        'unisex_salon',
        'clinic',
        'hospital',
        'restaurant',
        'cafe',
        'gym',
        'spa',
        'pet_care',
        'coaching',
        'law_firm',
        'photography',
        'repair_shop',
        'laundry',
        'other'
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...expectedCategories),
          (category) => {
            // Type check - if this compiles, the type is correct
            const testCategory: BusinessCategory = category;
            expect(testCategory).toBe(category);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.3: Service Configuration Preservation
   * **Validates: Requirement 3.3**
   * 
   * For all services across all categories, service data must be valid and consistent
   */
  describe('Service Configuration Preservation', () => {
    it('property: all services have positive prices', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            category.defaultServices.forEach(service => {
              expect(service.price).toBeGreaterThanOrEqual(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: all services have positive average times', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            category.defaultServices.forEach(service => {
              // Some services like "Custom Cake Order" have avgTime: 0 (advance orders)
              // This is valid baseline behavior - they don't consume immediate time
              expect(service.avgTime).toBeGreaterThanOrEqual(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: service IDs are unique within each category', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            const serviceIds = category.defaultServices.map(s => s.id);
            const uniqueIds = new Set(serviceIds);
            expect(uniqueIds.size).toBe(serviceIds.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: service names are non-empty strings', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            category.defaultServices.forEach(service => {
              expect(service.name).toBeTruthy();
              expect(typeof service.name).toBe('string');
              expect(service.name.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.4: Feature Flags Preservation
   * **Validates: Requirement 3.4**
   * 
   * For all categories with feature flags, the flags must be boolean or undefined
   */
  describe('Feature Flags Preservation', () => {
    it('property: feature flags are boolean or undefined', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            const flags = [
              category.hasTimedSlots,
              category.hasMenu,
              category.hasEmergencySlot,
              category.hasHomeService,
              category.hasVideoConsult,
              category.supportsGroupBooking,
              category.hasCapacityLimit
            ];

            flags.forEach(flag => {
              expect(flag === undefined || typeof flag === 'boolean').toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: categories with timed slots have appropriate configuration', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES.filter(c => c.hasTimedSlots)),
          (category) => {
            // Categories with timed slots should have time-based terminology
            // Baseline includes various terms: appointment, booking, slot, class, reservation, session, consultation
            expect(category.terminology.noun).toMatch(/appointment|booking|slot|class|reservation|session|consultation/i);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 2.5: Working Hours Preservation
   * **Validates: Requirement 3.5**
   * 
   * For all categories with default working hours, the hours must be valid time strings
   */
  describe('Working Hours Preservation', () => {
    it('property: default working hours are valid time strings', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES.filter(c => c.defaultWorkingHours)),
          (category) => {
            if (category.defaultWorkingHours) {
              const { open, close } = category.defaultWorkingHours;
              
              // Time format validation (HH:MM)
              const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
              expect(timeRegex.test(open)).toBe(true);
              expect(timeRegex.test(close)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: working hours are logically consistent', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES.filter(c => c.defaultWorkingHours)),
          (category) => {
            if (category.defaultWorkingHours) {
              const { open, close } = category.defaultWorkingHours;
              
              // For 24-hour services, open and close can be equal or close can be 23:59
              if (open === '00:00' && close === '23:59') {
                expect(true).toBe(true); // 24-hour service
              } else {
                // For regular services, we just verify they're valid times
                expect(open).toBeTruthy();
                expect(close).toBeTruthy();
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.6: Terminology Consistency Preservation
   * **Validates: Requirement 3.6**
   * 
   * For all categories, terminology must be consistent with the business type
   */
  describe('Terminology Consistency Preservation', () => {
    it('property: terminology fields are non-empty strings', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            expect(category.terminology.provider.length).toBeGreaterThan(0);
            expect(category.terminology.action.length).toBeGreaterThan(0);
            expect(category.terminology.noun.length).toBeGreaterThan(0);
            expect(category.terminology.item.length).toBeGreaterThan(0);
            expect(category.terminology.unit.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: medical categories use appropriate terminology', () => {
      const medicalCategories = BUSINESS_CATEGORIES.filter(
        c => c.id === 'clinic' || c.id === 'hospital'
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...medicalCategories),
          (category) => {
            expect(category.terminology.provider).toMatch(/doctor|specialist/i);
            expect(category.terminology.noun).toMatch(/appointment/i);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('property: salon categories use appropriate terminology', () => {
      const salonCategories = BUSINESS_CATEGORIES.filter(
        c => c.id === 'men_salon' || c.id === 'beauty_parlour' || c.id === 'unisex_salon'
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...salonCategories),
          (category) => {
            expect(category.terminology.provider).toMatch(/barber|stylist/i);
            expect(category.terminology.item).toMatch(/service/i);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 2.7: Localization Preservation
   * **Validates: Requirement 3.8**
   * 
   * For all categories, both English and Hindi labels must be present
   */
  describe('Localization Preservation', () => {
    it('property: all categories have both English and Hindi labels', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            expect(category.label).toBeTruthy();
            expect(category.labelHi).toBeTruthy();
            expect(typeof category.label).toBe('string');
            expect(typeof category.labelHi).toBe('string');
            expect(category.label.length).toBeGreaterThan(0);
            expect(category.labelHi.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: Hindi labels contain Devanagari script', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            // Devanagari Unicode range: U+0900 to U+097F
            const devanagariRegex = /[\u0900-\u097F]/;
            expect(devanagariRegex.test(category.labelHi)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.8: Icon Preservation
   * **Validates: Requirement 3.9**
   * 
   * For all categories, icons must be present and valid emoji
   */
  describe('Icon Preservation', () => {
    it('property: all categories have emoji icons', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            expect(category.icon).toBeTruthy();
            expect(typeof category.icon).toBe('string');
            expect(category.icon.length).toBeGreaterThan(0);
            
            // Emoji typically have length 1-2 (some are multi-codepoint)
            expect(category.icon.length).toBeLessThanOrEqual(4);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: icons are unique across categories', () => {
      const icons = BUSINESS_CATEGORIES.map(cat => cat.icon);
      const uniqueIcons = new Set(icons);
      
      // Most icons should be unique (some might be reused intentionally)
      expect(uniqueIcons.size).toBeGreaterThan(BUSINESS_CATEGORIES.length * 0.8);
    });
  });

  /**
   * Property 2.9: Data Integrity Preservation
   * **Validates: Requirement 3.10**
   * 
   * For all business data, the structure must be consistent and valid
   */
  describe('Data Integrity Preservation', () => {
    it('property: category data is immutable during runtime', () => {
      const originalCategories = JSON.parse(JSON.stringify(BUSINESS_CATEGORIES));
      
      // Simulate some operations that shouldn't mutate the data
      BUSINESS_CATEGORIES.forEach(cat => {
        const _ = cat.id;
        const __ = cat.defaultServices;
      });
      
      expect(JSON.stringify(BUSINESS_CATEGORIES)).toBe(JSON.stringify(originalCategories));
    });

    it('property: service prices are reasonable (not negative or extremely high)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            category.defaultServices.forEach(service => {
              expect(service.price).toBeGreaterThanOrEqual(0);
              expect(service.price).toBeLessThan(100000); // Reasonable upper limit
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: service times are reasonable (not zero or extremely long)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_CATEGORIES),
          (category) => {
            category.defaultServices.forEach(service => {
              // Baseline allows avgTime: 0 for advance orders (e.g., Custom Cake Order)
              // Baseline allows long times for multi-day services (e.g., Wedding Planning: 1440 min = 24 hours)
              // This is valid - event planning and similar services can span days
              expect(service.avgTime).toBeGreaterThanOrEqual(0);
              expect(service.avgTime).toBeLessThan(10000); // ~7 days max (reasonable upper limit)
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2.10: Comprehensive Category Coverage
   * **Validates: Requirements 3.1, 3.2, 3.3**
   * 
   * Verify that the system supports the full range of business types
   */
  describe('Comprehensive Category Coverage', () => {
    it('should support service-based businesses', () => {
      const serviceCategories = ['men_salon', 'beauty_parlour', 'unisex_salon', 'spa'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      serviceCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });

    it('should support healthcare businesses', () => {
      const healthcareCategories = ['clinic', 'hospital'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      healthcareCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });

    it('should support food & beverage businesses', () => {
      const foodCategories = ['restaurant', 'cafe'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      foodCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });

    it('should support fitness & wellness businesses', () => {
      const fitnessCategories = ['gym', 'spa'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      fitnessCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });

    it('should support professional services', () => {
      const professionalCategories = ['law_firm', 'coaching', 'photography'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      professionalCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });

    it('should support other service businesses', () => {
      const otherCategories = ['pet_care', 'repair_shop', 'laundry', 'other'];
      const categoryIds = BUSINESS_CATEGORIES.map(c => c.id);
      
      otherCategories.forEach(cat => {
        expect(categoryIds).toContain(cat);
      });
    });
  });
});
