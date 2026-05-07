/**
 * Bug Condition Exploration Test - Category Restriction
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test encodes the EXPECTED behavior (only 18 beauty/wellness categories).
 * When run on UNFIXED code, it will FAIL and surface counterexamples that demonstrate
 * non-beauty/wellness categories are accessible in the registry data.
 * 
 * After the fix is implemented, this test will PASS, validating the fix works correctly.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  BUSINESS_REGISTRY_GROUPS,
  ALL_BUSINESS_NICHE_ROWS,
} from '../config/businessRegistry.data';

// The 18 approved beauty and wellness category IDs
const APPROVED_BEAUTY_WELLNESS_IDS = [
  'mens_salon',
  'ladies_parlour',
  'unisex_salon',
  'spa_center',
  'nail_studio',
  'mehndi_artist',
  'tattoo_studio',
  'massage_therapy',
  'acupuncture_clinic',
  'makeup_artist',
  'bridal_studio',
  'threading_waxing',
  'skin_care_clinic',
  'hair_transplant',
  'laser_studio',
  'ayurveda_beauty',
  'slimming_studio',
  'home_salon',
];

// Non-beauty/wellness category IDs that should NOT exist
const NON_BEAUTY_CATEGORY_IDS = [
  'clinic',
  'hospital',
  'pet_care',
  'restaurant',
  'cafe',
  'gym',
  'coaching',
  'law_firm',
  'photography',
  'repair_shop',
  'laundry',
  'event_planner',
  'other_business',
];

// Non-beauty/wellness group IDs that should NOT exist
const NON_BEAUTY_GROUP_IDS = [
  'healthcare',
  'food',
  'fitness',
  'education',
  'services',
  'creative',
  'repairs',
  'other',
];

describe('Bug Condition Exploration - Category Restriction', () => {
  describe('Property 1: Bug Condition - Non-Beauty Categories Accessible', () => {
    it('should have ONLY 1 industry group (beauty) in registry', () => {
      // EXPECTED: 1 group (beauty only)
      // ACTUAL ON UNFIXED CODE: 9 groups (beauty, healthcare, food, fitness, education, services, creative, repairs, other)
      
      const groupCount = BUSINESS_REGISTRY_GROUPS.length;
      const groupIds = BUSINESS_REGISTRY_GROUPS.map(g => g.id);
      
      console.log('📊 Registry Groups Found:', groupCount);
      console.log('📋 Group IDs:', groupIds);
      
      expect(groupCount).toBe(1);
      expect(groupIds).toEqual(['beauty']);
    });

    it('should have ONLY beauty group in registry (no healthcare, food, fitness, etc.)', () => {
      // EXPECTED: Only "beauty" group exists
      // ACTUAL ON UNFIXED CODE: Multiple non-beauty groups exist
      
      const nonBeautyGroups = BUSINESS_REGISTRY_GROUPS.filter(
        g => NON_BEAUTY_GROUP_IDS.includes(g.id)
      );
      
      if (nonBeautyGroups.length > 0) {
        console.log('❌ Non-Beauty Groups Found:', nonBeautyGroups.map(g => `${g.id} (${g.label})`));
      }
      
      expect(nonBeautyGroups).toHaveLength(0);
    });

    it('should have ONLY 18 approved beauty/wellness categories', () => {
      // EXPECTED: Exactly 18 beauty/wellness categories
      // ACTUAL ON UNFIXED CODE: 17+ categories including non-beauty ones
      
      const categoryCount = ALL_BUSINESS_NICHE_ROWS.length;
      const categoryIds = ALL_BUSINESS_NICHE_ROWS.map(r => r.id);
      
      console.log('📊 Total Categories Found:', categoryCount);
      console.log('📋 Category IDs:', categoryIds);
      
      expect(categoryCount).toBe(18);
      expect(categoryIds.sort()).toEqual(APPROVED_BEAUTY_WELLNESS_IDS.sort());
    });

    it('should NOT contain any non-beauty/wellness categories', () => {
      // EXPECTED: No healthcare, food, fitness, or other industry categories
      // ACTUAL ON UNFIXED CODE: Contains clinic, hospital, restaurant, cafe, gym, etc.
      
      const nonBeautyCategories = ALL_BUSINESS_NICHE_ROWS.filter(
        r => NON_BEAUTY_CATEGORY_IDS.includes(r.id)
      );
      
      if (nonBeautyCategories.length > 0) {
        console.log('❌ Non-Beauty Categories Found:');
        nonBeautyCategories.forEach(cat => {
          console.log(`  - ${cat.id} (${cat.label}) [groupId: ${cat.groupId}]`);
        });
      }
      
      expect(nonBeautyCategories).toHaveLength(0);
    });

    it('should have ALL categories with groupId="beauty"', () => {
      // EXPECTED: All categories belong to "beauty" group
      // ACTUAL ON UNFIXED CODE: Categories have various groupIds (healthcare, food, fitness, etc.)
      
      const nonBeautyGroupCategories = ALL_BUSINESS_NICHE_ROWS.filter(
        r => r.groupId !== 'beauty'
      );
      
      if (nonBeautyGroupCategories.length > 0) {
        console.log('❌ Categories with non-beauty groupId:');
        nonBeautyGroupCategories.forEach(cat => {
          console.log(`  - ${cat.id} (${cat.label}) [groupId: ${cat.groupId}]`);
        });
      }
      
      expect(nonBeautyGroupCategories).toHaveLength(0);
    });
  });

  describe('Property-Based Test: Category Registry Invariants', () => {
    it('should maintain beauty-only restriction across all registry data', () => {
      // Property: For ANY category in the registry, it MUST be a beauty/wellness category
      
      fc.assert(
        fc.property(
          fc.constantFrom(...ALL_BUSINESS_NICHE_ROWS),
          (category) => {
            // Every category must have groupId="beauty"
            expect(category.groupId).toBe('beauty');
            
            // Every category must be in the approved list
            expect(APPROVED_BEAUTY_WELLNESS_IDS).toContain(category.id);
            
            // Every category must NOT be in the non-beauty list
            expect(NON_BEAUTY_CATEGORY_IDS).not.toContain(category.id);
            
            return true;
          }
        ),
        { numRuns: ALL_BUSINESS_NICHE_ROWS.length }
      );
    });

    it('should maintain single beauty group restriction', () => {
      // Property: For ANY group in the registry, it MUST be the beauty group
      
      fc.assert(
        fc.property(
          fc.constantFrom(...BUSINESS_REGISTRY_GROUPS),
          (group) => {
            // Every group must be "beauty"
            expect(group.id).toBe('beauty');
            
            // Every group must NOT be a non-beauty group
            expect(NON_BEAUTY_GROUP_IDS).not.toContain(group.id);
            
            return true;
          }
        ),
        { numRuns: BUSINESS_REGISTRY_GROUPS.length }
      );
    });
  });
});
