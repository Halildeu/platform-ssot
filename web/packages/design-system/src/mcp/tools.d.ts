import type { DriftReport } from '../intelligence/drift-detector';
import type { MCPComponentInfo, MCPExampleInfo, MCPTokenInfo, MCPSearchResult, MCPSuggestion, MCPValidationResult, MCPGeneratedCode, MCPLayoutProposal, MCPA11yReviewResult, MCPTestSuggestion, MCPComponentExplanation, MCPComparisonResult, MCPBundleOptimization, MCPTokenAuditResult, MCPPatternSuggestion, MCPDependencyTree, MCPQualityReport, MCPMigrationGuide, MCPFormSchemaResult, MCPPredictionReport } from './types';
/**
 * Tum bilesenlerin katalogunu dondurur.
 * Her bilesen icin isim, aciklama, kategori ve yasam dongusu bilgisi icerir.
 */
export declare function getComponentCatalog(): MCPComponentInfo[];
/**
 * Belirli bir bilesenin tam dokumantasyonunu dondurur.
 * Props, ornekler, erisilebilirlik notlari ve iliskili bilesenleri icerir.
 */
export declare function getComponentDoc(componentName: string): MCPComponentInfo | null;
/**
 * Bir bilesenin kullandigi tasarim tokenlarini dondurur.
 * CSS degiskeni, acik/koyu tema degerleri icerir.
 */
export declare function getComponentTokens(componentName: string): MCPTokenInfo[];
/**
 * Bir bilesenin ornek kodlarini dondurur.
 */
export declare function getComponentExamples(componentName: string): MCPExampleInfo[];
/**
 * Bilesenleri semantik olarak arar.
 * Isim, aciklama, tag ve prop eslesmelerini puanlar.
 */
export declare function searchComponents(query: string): MCPSearchResult[];
/**
 * Tum tasarim tokenlarini dondurur, opsiyonel kategori filtresi ile.
 */
export declare function getDesignTokens(category?: string): MCPTokenInfo[];
/**
 * Kullanim senaryosuna gore en uygun bileseni/bilesenleri onerir.
 * AI agent'lar icin optimize edilmis cikti uretir.
 */
export declare function suggestComponent(useCase: string): MCPSuggestion[];
/**
 * Bilesen prop kullanimini dogrular ve duzeltme onerileri sunar.
 */
export declare function validateUsage(componentName: string, props: Record<string, unknown>): MCPValidationResult;
/**
 * Dogal dil gereksinimlerinden bilesen kullanim kodu uretir.
 */
export declare function generateCode(componentName: string, requirements: string): MCPGeneratedCode | null;
/** 10. proposeLayout — Natural language → layout config */
export declare function proposeLayout(description: string, _catalog: Map<string, MCPComponentInfo>): MCPLayoutProposal;
/** 11. reviewAccessibility — a11y audit for a component */
export declare function reviewAccessibility(componentName: string, props: Record<string, unknown>, catalog: Map<string, MCPComponentInfo>): MCPA11yReviewResult;
/** 12. suggestTestCases — generate test scenarios from component API */
export declare function suggestTestCases(componentName: string, catalog: Map<string, MCPComponentInfo>): MCPTestSuggestion[];
/** 13. explainComponent — when to use, when not to use */
export declare function explainComponent(componentName: string, catalog: Map<string, MCPComponentInfo>): MCPComponentExplanation | null;
/** 14. compareComponents — side by side comparison */
export declare function compareComponents(a: string, b: string, catalog: Map<string, MCPComponentInfo>): MCPComparisonResult | null;
/** 15. optimizeBundle — bundle impact analysis */
export declare function optimizeBundle(components: string[]): MCPBundleOptimization;
/** 16. auditTokenUsage — detect hardcoded values in code */
export declare function auditTokenUsage(code: string): MCPTokenAuditResult;
/** 17. suggestPattern — component combo → pattern suggestion */
export declare function suggestPattern(components: string[], _catalog: Map<string, MCPComponentInfo>): MCPPatternSuggestion[];
/** 18. getComponentDependencies — dependency tree */
export declare function getComponentDependencies(componentName: string, catalog: Map<string, MCPComponentInfo>): MCPDependencyTree | null;
/** 19. getQualityReport — component quality metrics */
export declare function getQualityReport(componentName: string | undefined, catalog: Map<string, MCPComponentInfo>): MCPQualityReport;
/** 20. migrateComponent — version migration guide */
export declare function migrateComponent(componentName: string, fromVersion: string, catalog: Map<string, MCPComponentInfo>): MCPMigrationGuide | null;
/** 21. generateFormSchema — natural language → Zod schema */
export declare function generateFormSchema(description: string): MCPFormSchemaResult;
/** 22. predictComponents — predict missing components from source code */
export declare function predictComponents(code: string): MCPPredictionReport;
/** 23. detectDesignDrift — detect design system drift in code */
export declare function detectDesignDrift(code: string, fileName?: string): DriftReport;
