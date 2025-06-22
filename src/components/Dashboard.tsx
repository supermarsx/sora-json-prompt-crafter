import React, { useState, useEffect } from 'react';
import { diffChars, Change } from 'diff';
import { Sun, Moon, Heart, Github, Star, GitFork, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ControlPanel } from './ControlPanel';
import { ShareModal } from './ShareModal';
import { ProgressBar } from './ProgressBar';
import { ActionBar } from './ActionBar';
import HistoryPanel, { HistoryEntry } from './HistoryPanel';
import ImportModal from './ImportModal';
import Footer from './Footer';
import DisclaimerModal from './DisclaimerModal';
import { useIsSingleColumn } from '@/hooks/use-single-column';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useTracking } from '@/hooks/use-tracking';
import { useActionHistory } from '@/hooks/use-action-history';
import { trackEvent } from '@/lib/analytics'
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions'
import { generateJson } from '@/lib/generateJson'
import type { SoraOptions } from '@/lib/soraOptions'

const Dashboard = () => {
  const [options, setOptions] = useState<SoraOptions>(() => {
    try {
      return DEFAULT_OPTIONS;
    } catch (error) {
      console.error('Error initializing options:', error);
      return DEFAULT_OPTIONS;
    }
  });

  const firstLoadRef = React.useRef(true)

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState(() => {
    try {
      return localStorage.getItem('currentJson') || '{}';
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return '{}';
    }
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jsonHistory') || '[]');
    } catch (error) {
      console.error('Error parsing history from localStorage:', error);
      return [];
    }
  });
  const jsonContainerRef = React.useRef<HTMLDivElement>(null);
  const prevJsonRef = React.useRef(jsonString);
  const [diffParts, setDiffParts] = useState<Change[] | null>(null);
  const isSingleColumn = useIsSingleColumn();
  const [darkMode, setDarkMode] = useDarkMode();
  const [trackingEnabled, setTrackingEnabled] = useTracking();
  const actionHistory = useActionHistory();
  const [githubStats, setGithubStats] = useState<{
    stars: number
    forks: number
    issues: number
  }>()

  useEffect(() => {
    fetch('https://api.github.com/repos/supermarsx/sora-json-prompt-crafter')
      .then(res => res.json())
      .then(data =>
        setGithubStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          issues: data.open_issues_count,
        })
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    const times = [3, 5, 10, 30, 60]
    const timers = times.map(t =>
      setTimeout(() => trackEvent(trackingEnabled, `stay_${t}min`), t * 60 * 1000)
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [trackingEnabled])

  useEffect(() => {
    try {
      localStorage.setItem('jsonHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('currentJson', jsonString);
    } catch (error) {
      console.error('Error saving JSON to localStorage:', error);
    }
  }, [jsonString, trackingEnabled]);

  useEffect(() => {
    try {
      const diff = diffChars(prevJsonRef.current, jsonString).filter(p => !p.removed);
      prevJsonRef.current = jsonString;
      setDiffParts(diff);
      const timer = setTimeout(() => {
        setDiffParts(diff.map(p => ({ ...p, added: false } as Change)));
      }, 2000);
      trackEvent(trackingEnabled, 'json_changed');
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error processing diff:', error);
    }
  }, [jsonString, trackingEnabled]);

  useEffect(() => {
    const container = jsonContainerRef.current;
    if (!container) return;
    const atBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 5;
    const atTop = container.scrollTop === 0;
    if (atBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (atTop) {
      container.scrollTop = 0;
    }
  }, [jsonString]);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    try {
      const json = generateJson(options);
      setJsonString(json);
      localStorage.setItem('currentJson', json);
    } catch (error) {
      console.error('Error generating JSON:', error);
      setJsonString('{}');
    }
  }, [options])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        json: jsonString,
      };
      setHistory((prev) => [entry, ...prev]);
      toast.success('Sora JSON copied to clipboard!');
      const opts = options as unknown as Record<string, unknown>
      const sections = Object.keys(options).filter(key => key.startsWith('use_') && opts[key])
      trackEvent(trackingEnabled, 'copy_json', { sections: sections.join(',') })
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearJson = () => {
    setJsonString('{}');
    toast.success('JSON cleared!');
    trackEvent(trackingEnabled, 'clear_json');
  };

  const shareJson = () => {
    setShowShareModal(true);
    trackEvent(trackingEnabled, 'share_button');
  };

  const importJson = (json: string) => {
    try {
      const obj = JSON.parse(json);
      setOptions(prev => ({ ...prev, ...obj }));
      setShowImportModal(false);
      toast.success('JSON imported!');
      trackEvent(trackingEnabled, 'import_button');
    } catch {
      toast.error('Invalid JSON');
    }
  };

  const resetJson = () => {
    // Reset to default options
    setOptions(DEFAULT_OPTIONS);
    toast.success('Settings reset to defaults!');
    trackEvent(trackingEnabled, 'reset_button');
  };

  const regenerateJson = () => {
    setOptions(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
    toast.success('JSON regenerated with new seed!');
    trackEvent(trackingEnabled, 'regenerate_button');
  };

  const randomizeJson = () => {
    const randomOptions: Partial<SoraOptions> = {
      seed: Math.floor(Math.random() * 10000),
      steps: Math.floor(Math.random() * 31) + 20,
      guidance_scale: Math.random() * 12 + 3,
      quality: ['defective', 'poor', 'moderate', 'high', 'excellent'][
        Math.floor(Math.random() * 5)
      ] as SoraOptions['quality'],
      temperature: Math.random() * 0.5 + 0.8,
      motion_strength: Math.random(),
    };
    
    setOptions(prev => ({ ...prev, ...randomOptions }));
    toast.success('Options randomized!');
    trackEvent(trackingEnabled, 'randomize_button');
  };

  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions(prev => {
      const next = { ...prev, ...updates }
      Object.keys(updates).forEach(key => {
        const value = updates[key as keyof SoraOptions]
        if (key.startsWith('use_')) {
          if (
            typeof value === 'boolean' &&
            value !== prev[key as keyof SoraOptions]
          ) {
            trackEvent(trackingEnabled, 'section_toggle', {
              section: key,
              enabled: value,
            })
          }
        } else if (key === 'prompt') {
          trackEvent(trackingEnabled, 'prompt_change')
        } else if (key === 'negative_prompt') {
          trackEvent(trackingEnabled, 'negative_prompt_change')
        } else {
          trackEvent(trackingEnabled, 'input_change')
        }
      })
      return next
    })
  };

  const updateNestedOptions = (path: string, value: unknown) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = newOptions;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) };
        current = current[keys[i]] as Record<string, unknown>;
      }
      
      current[keys[keys.length - 1]] = value;
      trackEvent(trackingEnabled, 'input_change')
      return newOptions;
    });
  };

  const deleteHistoryEntry = (id: number) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => setHistory([]);

  const copyHistoryEntry = async (json: string) => {
    try {
      await navigator.clipboard.writeText(json);
      toast.success('Sora JSON copied to clipboard!');
      trackEvent(trackingEnabled, 'history_copy');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const editHistoryEntry = (json: string) => {
    try {
      const obj = JSON.parse(json);
      const enableMap: Record<string, keyof SoraOptions> = {
        negative_prompt: 'use_negative_prompt',
        width: 'use_dimensions_format',
        height: 'use_dimensions_format',
        aspect_ratio: 'use_dimensions_format',
        output_format: 'use_dimensions_format',
        dynamic_range: 'use_dimensions_format',
        style_preset: 'use_style_preset',
        made_out_of: 'use_material',
        secondary_material: 'use_secondary_material',
        lighting: 'use_lighting',
        color_grade: 'use_color_grading',
        environment: 'use_environment',
        location: 'use_location',
        year: 'use_settings_location',
        season: 'use_season',
        atmosphere_mood: 'use_atmosphere_mood',
        subject_mood: 'use_subject_mood',
        sword_type: 'use_sword_type',
        sword_vibe: 'use_sword_type',
        upscale: 'use_upscale_factor',
        safety_filter: 'use_safety_filter',
        quality_booster: 'use_quality_booster',
        prevent_deformities: 'use_enhancement_safety',
        keep_typography_details: 'use_enhancement_safety',
        enhance_object_reflections: 'use_enhancement_safety',
        keep_key_details: 'use_enhancement_safety',
        add_same_face: 'use_face_enhancements',
        dont_change_face: 'use_face_enhancements',
        subject_gender: 'use_subject_gender',
        makeup_style: 'use_makeup_style',
        character_mood: 'use_character_mood',
        black_and_white_preset: 'use_black_and_white',
        special_effects: 'use_special_effects',
        lut_preset: 'use_lut_preset',
        dnd_character_race: 'use_dnd_character_race',
        dnd_character_class: 'use_dnd_character_class',
        dnd_character_background: 'use_dnd_character_background',
        dnd_character_alignment: 'use_dnd_character_alignment',
        dnd_monster_type: 'use_dnd_monster_type',
        dnd_environment: 'use_dnd_environment',
        dnd_magic_school: 'use_dnd_magic_school',
        dnd_item_type: 'use_dnd_item_type',
        camera_angle: 'use_camera_composition',
        shot_type: 'use_camera_composition',
        subject_focus: 'use_camera_composition',
        composition_rules: 'use_camera_composition',
        camera_type: 'use_camera_composition',
        lens_type: 'use_lens_type',
        aperture: 'use_aperture',
        depth_of_field: 'use_dof',
        blur_style: 'use_blur_style',
        motion_strength: 'use_motion_animation',
        camera_motion: 'use_motion_animation',
        motion_direction: 'use_motion_animation',
        fps: 'use_motion_animation',
        frame_interpolation: 'use_motion_animation',
        duration_seconds: 'use_duration',
        seed: 'use_core_settings',
        steps: 'use_core_settings',
        guidance_scale: 'use_core_settings',
        temperature: 'use_core_settings',
        cfg_rescale: 'use_core_settings',
        quality: 'use_core_settings',
        signature: 'use_signature',
      };

      const flagUpdates: Partial<SoraOptions> = {};
      Object.keys(obj).forEach(key => {
        const flag = enableMap[key as keyof typeof enableMap];
        if (flag) flagUpdates[flag as keyof SoraOptions] = true;
        if (key.startsWith('dnd_')) flagUpdates.use_dnd_section = true;
        if (key === 'width' || key === 'height') flagUpdates.use_dimensions = true;
      });
      setJsonString('{}');
      setOptions(prev => ({ ...prev, ...obj, ...flagUpdates }));
      document
        .getElementById('generated-json')
        ?.scrollIntoView({ behavior: 'smooth' });
      trackEvent(trackingEnabled, 'selected_json_prompt');
      trackEvent(trackingEnabled, 'history_edit');
    } catch {
      toast.error('Invalid JSON');
    }
  };

  const importHistoryEntries = (jsons: string[]) => {
    const entries = jsons.map(j => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleString(),
      json: j,
    }));
    setHistory(prev => [...entries, ...prev]);
    trackEvent(trackingEnabled, 'history_import', { type: 'bulk' });
  };

  const scrollToJson = () => {
    document
      .getElementById('generated-json')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto p-6 flex flex-col flex-1">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 select-none">
              <img
                src="/web-app-manifest-512x512.png"
                alt=""
                className="w-10 h-10 animate-rainbow dark:animate-rainbow-dark"
              />
              Sora JSON Prompt Crafter
            </h1>
            <p className="text-muted-foreground select-none">Configure your Sora generation settings and get the perfect JSON prompt for stunning AI-generated content.</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://github.com/sponsors/supermarsx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'click_sponsor')}
                >
                  <Heart className="w-4 h-4" /> Sponsor
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://github.com/supermarsx/sora-json-prompt-crafter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'see_github')}
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://github.com/supermarsx/sora-json-prompt-crafter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'star_github')}
                >
                  <Star className="w-4 h-4" />
                  Star{githubStats?.stars ? ` ${githubStats.stars}` : ''}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://github.com/supermarsx/sora-json-prompt-crafter/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'fork_github')}
                >
                  <GitFork className="w-4 h-4" />
                  Fork{githubStats?.forks ? ` ${githubStats.forks}` : ''}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://github.com/supermarsx/sora-json-prompt-crafter/issues/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'open_issues')}
                >
                  <Bug className="w-4 h-4" />
                  Issues{githubStats?.issues ? ` ${githubStats.issues}` : ''}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'view_on_lovable')}
                >
                  <Heart className="w-4 h-4" />
                  View on Lovable
                </a>
              </Button>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">
              By using this tool you agree by the{' '}
              <button
                onClick={() => {
                  setShowDisclaimer(true)
                  trackEvent(trackingEnabled, 'open_disclaimer')
                }}
                className="underline"
              >
                full disclaimer
              </button>
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setDarkMode(!darkMode)
              trackEvent(trackingEnabled, 'dark_mode_toggle', { enabled: !darkMode })
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 flex-1">
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ControlPanel
                  options={options}
                  updateOptions={updateOptions}
                  updateNestedOptions={updateNestedOptions}
                  trackingEnabled={trackingEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            id="generated-json"
            className="flex flex-col lg:sticky lg:top-4 lg:max-h-[calc(100vh-1rem)]"
          >
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Generated JSON Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto" ref={jsonContainerRef}>
                <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>
                    {diffParts
                      ? diffParts.map((part, idx) => (
                          <span
                            key={idx}
                            className={part.added ? "animate-highlight" : undefined}
                          >
                            {part.value}
                          </span>
                        ))
                      : jsonString}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ActionBar
        onCopy={copyToClipboard}
        onClear={clearJson}
        onShare={shareJson}
        onImport={() => setShowImportModal(true)}
        onHistory={() => setShowHistory(true)}
        onReset={resetJson}
        onRegenerate={regenerateJson}
        onRandomize={randomizeJson}
        trackingEnabled={trackingEnabled}
        onToggleTracking={() => setTrackingEnabled(!trackingEnabled)}
        copied={copied}
        showJumpToJson={isSingleColumn}
        onJumpToJson={scrollToJson}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jsonContent={jsonString}
      />
      <HistoryPanel
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        actionHistory={actionHistory}
        onDelete={deleteHistoryEntry}
        onClear={clearHistory}
        onCopy={copyHistoryEntry}
        onEdit={editHistoryEntry}
        onImport={importHistoryEntries}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={importJson}
      />
      <DisclaimerModal open={showDisclaimer} onOpenChange={setShowDisclaimer} />
      <Footer
        onShowDisclaimer={() => {
          setShowDisclaimer(true)
          trackEvent(trackingEnabled, 'open_disclaimer')
        }}
      />
      <ProgressBar />
    </div>
  );
};

export default Dashboard;
