
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  forkJoin,
  of,
  Observable
} from 'rxjs';

import {
  catchError,
  map,
  defaultIfEmpty
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BarcodeServService {

  constructor(private http: HttpClient) {}

  // ==========================================
  // Main Barcode Lookup
  // ==========================================

  getProductByBarcode(barcode: string): Observable<any> {debugger;

    const cleanBarcode = barcode.trim();

    return forkJoin({

      food: this.searchOpenFoodFacts(cleanBarcode),

      upc: this.searchUPCItemDB(cleanBarcode),

      medicine: this.searchOpenFDA(cleanBarcode)

    }).pipe(

      map(({ food, upc, medicine }) => {debugger;

        // Collect successful API responses
        const results: any[] = [
          upc,
          food,
          medicine
        ].filter(Boolean);

        // No product found
        if (!results.length) {
          return null;
        }

        // Get first available value
        const getValue = (key: string) => {

          return results.find(
            item =>
              item[key] !== null &&
              item[key] !== undefined &&
              item[key] !== ''
          )?.[key] ?? null;

        };

        // Normalized product response
        return {

          barcode: cleanBarcode,

          itemName: getValue('itemName'),

          description: getValue('description'),

          brand: getValue('brand'),

          category: getValue('category'),

          netWeight: getValue('netWeight'),

          manufacturer: getValue('manufacturer'),

          supplier: getValue('supplier'),

          composition: getValue('composition'),

          dosageForm: getValue('dosageForm'),

          strength: getValue('strength'),

          mrp: getValue('mrp'),

          image: getValue('image'),

          sources: results.map(item => ({
            name: item.source,
            url: item.sourceUrl
          }))

        };

      })

    );

  }


  // ==========================================
  // Reusable API Error Handler
  // ==========================================

  private safeApiCall<T>(
    apiName: string,
    request: Observable<T>
  ): Observable<T | null> {

    return request.pipe(

      catchError((error: any) => {

        console.error(`${apiName} API failed:`, error);

        return of(null);

      }),

      defaultIfEmpty(null)

    );

  }


  // ==========================================
  // UPCitemDB API
  // ==========================================

  private searchUPCItemDB(barcode: string) {

    const request = this.http.get<any>(
      'https://api.upcitemdb.com/prod/trial/lookup',
      {
        params: {
          upc: barcode
        }
      }
    ).pipe(

      map(response => {

        const item = response.items?.[0];

        if (!item) {
          return null;
        }

        return {

          itemName: item.title || null,

          description: item.description || null,

          brand: item.brand || null,

          category: item.category || null,

          netWeight: item.weight || null,

          manufacturer: null,

          supplier: null,

          composition: null,

          dosageForm: null,

          strength: null,

          mrp: null,

          image: item.images?.[0] || null,

          source: 'UPCitemDB',

          sourceUrl: `https://www.upcitemdb.com/upc/${barcode}`

        };

      })

    );

    return this.safeApiCall('UPCitemDB', request);

  }


  // ==========================================
  // Open Food Facts API
  // ==========================================

  private searchOpenFoodFacts(barcode: string) {

    const fields = [

      'product_name',

      'generic_name',

      'brands',

      'categories',

      'quantity',

      'ingredients_text',

      'image_url',

      'manufacturing_places'

    ].join(',');


    const request = this.http.get<any>(
      `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(barcode)}`,
      {
        params: {
          fields
        }
      }
    ).pipe(

      map(response => {

        const item = response.product;

        if (!item) {
          return null;
        }

        return {

          itemName: item.product_name || null,

          description:
            item.generic_name ||
            item.ingredients_text ||
            null,

          brand: item.brands || null,

          category: item.categories || null,

          netWeight: item.quantity || null,

          manufacturer: item.manufacturing_places || null,

          supplier: null,

          composition: item.ingredients_text || null,

          dosageForm: null,

          strength: null,

          mrp: null,

          image: item.image_url || null,

          source: 'Open Food Facts',

          sourceUrl: `https://world.openfoodfacts.org/product/${barcode}`

        };

      })

    );

    return this.safeApiCall('Open Food Facts', request);

  }


  // ==========================================
  // OpenFDA Medicine API
  // ==========================================

  private searchOpenFDA(barcode: string) {

    const request = this.http.get<any>(
      'https://api.fda.gov/drug/ndc.json',
      {
        params: {

          search:
            `packaging.package_ndc:"${barcode}" OR product_ndc:"${barcode}"`,

          limit: '5'

        }
      }
    ).pipe(

      map(response => {

        const item = response.results?.[0];

        if (!item) {
          return null;
        }

        const product = item.products?.[0];

        const ingredients = product?.active_ingredients || [];

        const composition = ingredients.length
          ? ingredients
              .map((x: any) => `${x.name} ${x.strength}`)
              .join(', ')
          : null;

        return {

          itemName:
            product?.brand_name ||
            item.brand_name ||
            null,

          description: composition,

          brand:
            product?.brand_name ||
            item.brand_name ||
            null,

          category:
            product?.dosage_form ||
            null,

          netWeight: null,

          manufacturer:
            item.labeler_name ||
            null,

          supplier: null,

          composition,

          dosageForm:
            product?.dosage_form ||
            null,

          strength: ingredients.length
            ? ingredients
                .map((x: any) => x.strength)
                .join(', ')
            : null,

          mrp: null,

          image: null,

          source: 'OpenFDA',

          sourceUrl: 'https://open.fda.gov/apis/drug/ndc/'

        };

      })

    );

    return this.safeApiCall('OpenFDA', request);

  }

}
  