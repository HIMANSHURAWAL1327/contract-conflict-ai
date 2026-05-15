/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  FileSearch,
  History,
  ShieldCheck,
  Zap,
  Gavel
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { analyzeContracts, AnalysisResult, Conflict } from './gemini';
import { cn } from './utils';
import { extractTextFromFile } from './fileUtils';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { ScrollArea } from './ScrollArea';
import { Badge } from './Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { Separator } from './Separator';

export default function App() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file1 || !file2) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const text1 = await extractTextFromFile(file1);
      const text2 = await extractTextFromFile(file2);
      
      if (!text1.trim() || !text2.trim()) {
        throw new Error("One or both files appear to be empty or could not be read.");
      }

      const analysis = await analyzeContracts(text1, text2);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Analysis failed. Please ensure both files are valid documents.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="border-b border-primary/10 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-serif italic text-gradient">Contract Conflict AI</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Legal Intelligence</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-all hover:translate-y-[-1px]">Dashboard</a>
            <a href="#" className="hover:text-primary transition-all hover:translate-y-[-1px]">Templates</a>
            <a href="#" className="hover:text-primary transition-all hover:translate-y-[-1px]">History</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="font-bold">Sign In</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 font-bold px-6">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
                v2.0 AI Engine
              </Badge>
              <h2 className="text-4xl font-serif italic font-medium tracking-tight leading-tight">
                Detect Conflicts <br />
                <span className="text-gradient">Automatically</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Upload your legal documents and let our AI engine identify contradictory clauses with precision.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                <FileUpload 
                  label="Primary Contract" 
                  file={file1} 
                  onFileSelect={setFile1} 
                  className="bg-black/20 hover:bg-black/40 transition-colors"
                />
              </div>
              <div className="p-1 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl">
                <FileUpload 
                  label="Secondary Contract" 
                  file={file2} 
                  onFileSelect={setFile2} 
                  className="bg-black/20 hover:bg-black/40 transition-colors"
                />
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]" 
              disabled={!file1 || !file2 || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Analyzing Clauses...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3 fill-current" />
                  Run Conflict Check
                </>
              )}
            </Button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive text-sm flex gap-3"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="pt-8 border-t border-muted/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Key Features</h3>
              <ul className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Risk Assessment", desc: "Automated severity scoring for each conflict." },
                  { icon: History, title: "Version Control", desc: "Compare different iterations of the same contract." },
                  { icon: FileSearch, title: "Deep Analysis", desc: "Powered by advanced NLP for semantic matching." }
                ].map((feature, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full min-h-[600px] border-2 border-dashed border-primary/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 glass relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center text-primary mb-8 animate-float shadow-inner">
                      <FileSearch className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-serif italic font-medium mb-4">Ready for Analysis</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto text-lg leading-relaxed">
                      Your legal analysis workspace is ready. Upload your contracts on the left to begin the automated conflict detection process.
                    </p>
                    <div className="mt-12 flex gap-4 opacity-40">
                      <div className="w-12 h-1 bg-primary rounded-full" />
                      <div className="w-12 h-1 bg-accent rounded-full" />
                      <div className="w-12 h-1 bg-primary rounded-full" />
                    </div>
                  </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="relative mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scale className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif italic font-medium mb-2">Analyzing Legal Frameworks</h3>
                  <p className="text-muted-foreground animate-pulse">Cross-referencing clauses and identifying contradictions...</p>
                </motion.div>
              ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <Card className="border-none shadow-2xl shadow-primary/10 overflow-hidden glass rounded-[2rem]">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/10 py-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-3xl font-serif italic text-primary">Analysis Summary</CardTitle>
                            <CardDescription className="text-primary/60 font-medium">Overview of identified legal discrepancies</CardDescription>
                          </div>
                          <Badge className="px-6 py-2 text-sm bg-primary text-white shadow-lg shadow-primary/20 border-none rounded-full font-bold">
                            {result?.conflicts.length} Conflicts Found
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-8 pb-10 space-y-8">
                        <div className="space-y-4">
                          <p className="text-lg text-muted-foreground leading-relaxed italic font-serif">
                            "{result?.summary}"
                          </p>
                        </div>

                        {result?.legal_suggestions && result.legal_suggestions.length > 0 && (
                          <div className="pt-8 border-t border-primary/10 space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                              <Gavel className="w-4 h-4" />
                              Strategic Legal Suggestions
                            </h4>
                            <ul className="grid gap-3">
                              {result.legal_suggestions.map((suggestion, i) => (
                                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <h3 className="text-xl font-serif italic font-medium flex items-center gap-3 text-primary">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        Detailed Conflict Report
                      </h3>
                      
                      <div className="grid gap-6">
                        {result?.conflicts.map((conflict, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Card className="group hover:shadow-2xl transition-all duration-500 border-primary/10 overflow-hidden glass rounded-3xl">
                              <div className="p-8 space-y-8">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-3">
                                    <Badge className={cn("capitalize border-none px-4 py-1 font-bold shadow-sm", 
                                      conflict.severity === 'high' ? 'bg-destructive text-white' : 
                                      conflict.severity === 'medium' ? 'bg-amber-500 text-white' : 
                                      'bg-blue-500 text-white'
                                    )}>
                                      {conflict.severity} Severity
                                    </Badge>
                                    <p className="text-base text-muted-foreground leading-relaxed font-medium">{conflict.explanation}</p>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Contract 1 Clause</p>
                                    <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-sm italic font-serif leading-relaxed relative group-hover:bg-destructive/10 transition-colors">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-destructive/30 rounded-full" />
                                      "{conflict.contract1_clause}"
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Contract 2 Clause</p>
                                    <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-sm italic font-serif leading-relaxed relative group-hover:bg-destructive/10 transition-colors">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-destructive/30 rounded-full" />
                                      "{conflict.contract2_clause}"
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-4 relative overflow-hidden group-hover:bg-accent/10 transition-colors">
                                  <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldCheck className="w-12 h-12 text-accent" />
                                  </div>
                                  <div className="flex items-center gap-3 text-accent">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">Recommended Alternative</p>
                                  </div>
                                  <p className="text-base font-semibold text-foreground leading-relaxed pl-8">
                                    {conflict.standardized_alternative}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-16 glass mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <span className="font-serif italic font-bold text-xl text-gradient">Contract Conflict AI</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 Contract Conflict AI. Empowering legal teams with Intelligence.</p>
          <div className="flex gap-8 text-sm font-bold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
