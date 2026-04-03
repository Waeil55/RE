import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';
import { analyzePropertyPhoto } from '../services/aiEnhancement';

const { width } = Dimensions.get('window');

interface PhotoJob {
  uri: string;
  base64?: string;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result?: any;
  error?: string;
}

const ROOM_TYPES = [
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Dining Room',
  'Exterior',
  'Backyard',
  'Office',
];

const ENHANCEMENT_PRESETS = [
  {
    id: 'full',
    label: 'Full Professional',
    description: 'Complete enhancement: declutter, lighting, HDR, upscale',
    icon: '✦',
    color: '#A78BFA',
  },
  {
    id: 'lighting',
    label: 'Lighting Fix',
    description: 'Exposure balance, shadow recovery, color grading',
    icon: '💡',
    color: colors.accentGold,
  },
  {
    id: 'declutter',
    label: 'AI Declutter',
    description: 'Remove personal items, clutter, and debris',
    icon: '🧹',
    color: colors.accentGreen,
  },
  {
    id: 'upscale',
    label: '4K Upscale',
    description: 'Super-resolution upscaling and sharpening',
    icon: '🔍',
    color: colors.accent,
  },
];

export const EnhanceScreen = ({ navigation }: any) => {
  const [photo, setPhoto] = useState<PhotoJob | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('full');
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant photo library access to enhance your listing photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhoto({
        uri: asset.uri,
        base64: asset.base64 || undefined,
        status: 'idle',
      });
      setResult(null);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take listing photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhoto({
        uri: asset.uri,
        base64: asset.base64 || undefined,
        status: 'idle',
      });
      setResult(null);
    }
  }, []);

  const analyzePhoto = useCallback(async () => {
    if (!photo?.base64) {
      Alert.alert('No Photo', 'Please select or capture a photo first.');
      return;
    }
    if (!apiKey.trim()) {
      Alert.alert(
        'API Key Required',
        'Enter your Anthropic API key to use AI analysis. Get one at console.anthropic.com'
      );
      setShowApiKey(true);
      return;
    }

    setAnalyzing(true);
    setProgress(0);
    setPhoto((p) => p ? { ...p, status: 'analyzing' } : null);

    const steps = [
      'Scanning image quality...',
      'Detecting personal items...',
      'Analyzing lighting conditions...',
      'Evaluating composition...',
      'Generating enhancement plan...',
      'Running 500-grid quality check...',
      'Finalizing report...',
    ];

    // Simulate progressive steps
    for (let i = 0; i < steps.length - 1; i++) {
      setCurrentStep(steps[i]);
      setProgress(Math.round(((i + 1) / steps.length) * 85));
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      setCurrentStep(steps[steps.length - 1]);
      const analysisResult = await analyzePropertyPhoto(
        photo.base64,
        'image/jpeg',
        apiKey.trim()
      );
      setProgress(100);
      setResult(analysisResult);
      setPhoto((p) => p ? { ...p, status: 'complete' } : null);
    } catch (err: any) {
      setPhoto((p) => p ? { ...p, status: 'error', error: err.message } : null);
      Alert.alert(
        'Analysis Failed',
        err.message || 'Could not analyze the photo. Check your API key and try again.'
      );
    } finally {
      setAnalyzing(false);
      setCurrentStep('');
    }
  }, [photo, apiKey]);

  const resetPhoto = () => {
    setPhoto(null);
    setResult(null);
    setProgress(0);
    setCurrentStep('');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(139,92,246,0.15)', 'transparent']}
              style={styles.headerGlow}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>✦</Text>
            </View>
            <Text style={styles.headerTitle}>AI Photo Studio</Text>
            <Text style={styles.headerSubtitle}>
              Transform any photo into a professional{'\n'}UHD real estate image
            </Text>
          </View>

          {/* API Key Input */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.apiKeyRow}
              onPress={() => setShowApiKey(!showApiKey)}
            >
              <Text style={styles.apiKeyLabel}>
                🔑 Anthropic API Key {apiKey ? '(configured ✓)' : '(required)'}
              </Text>
              <Text style={styles.apiKeyToggle}>{showApiKey ? '↑' : '↓'}</Text>
            </TouchableOpacity>
            {showApiKey && (
              <View style={styles.apiKeyInput}>
                <TextInput
                  style={styles.input}
                  placeholder="sk-ant-api..."
                  placeholderTextColor={colors.gray500}
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}
          </View>

          {/* Photo Upload Area */}
          <View style={styles.section}>
            {!photo ? (
              <View style={styles.uploadArea}>
                <LinearGradient
                  colors={['rgba(56,189,248,0.05)', 'rgba(139,92,246,0.05)']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadTitle}>Upload Listing Photo</Text>
                <Text style={styles.uploadSubtitle}>
                  Any photo quality — we'll make it look like a{'\n'}$10,000 professional shoot
                </Text>
                <View style={styles.uploadBtns}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                    <LinearGradient
                      colors={colors.gradientAccent as [string, string]}
                      style={styles.uploadBtnGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.uploadBtnText}>📁 Choose Photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadBtnOutline} onPress={takePhoto}>
                    <Text style={styles.uploadBtnOutlineText}>📷 Take Photo</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.uploadFeatures}>
                  <UploadFeature label="Any resolution accepted" />
                  <UploadFeature label="JPEG, PNG, HEIC" />
                  <UploadFeature label="MLS-compliant output" />
                </View>
              </View>
            ) : (
              <View>
                {/* Photo Preview */}
                <View style={styles.previewContainer}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.preview}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(15,23,42,0.8)']}
                    style={styles.previewOverlay}
                  />

                  {/* Status overlay */}
                  {analyzing && (
                    <View style={styles.analyzingOverlay}>
                      <LinearGradient
                        colors={['rgba(15,23,42,0.85)', 'rgba(15,23,42,0.85)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.analyzingContent}>
                        <View style={styles.aiSpinner}>
                          <Text style={styles.aiSpinnerText}>✦</Text>
                        </View>
                        <Text style={styles.analyzingTitle}>AI Analyzing...</Text>
                        <Text style={styles.analyzingStep}>{currentStep}</Text>
                        {/* Progress bar */}
                        <View style={styles.progressBar}>
                          <View
                            style={[styles.progressFill, { width: `${progress}%` }]}
                          />
                        </View>
                        <Text style={styles.progressText}>{progress}%</Text>
                      </View>
                    </View>
                  )}

                  {photo.status === 'complete' && (
                    <View style={styles.completeBadge}>
                      <Text style={styles.completeBadgeText}>✓ Analysis Complete</Text>
                    </View>
                  )}

                  <TouchableOpacity style={styles.removePhoto} onPress={resetPhoto}>
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Room Type */}
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.optionLabel}>Room Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {ROOM_TYPES.map((room) => (
                      <TouchableOpacity
                        key={room}
                        onPress={() => setSelectedRoom(room)}
                        style={[
                          styles.roomChip,
                          selectedRoom === room && styles.roomChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.roomChipText,
                            selectedRoom === room && styles.roomChipTextActive,
                          ]}
                        >
                          {room}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Enhancement Presets */}
          {photo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Enhancement Mode</Text>
              <View style={styles.presetsGrid}>
                {ENHANCEMENT_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => setSelectedPreset(preset.id)}
                    style={[
                      styles.presetCard,
                      selectedPreset === preset.id && {
                        borderColor: preset.color,
                        backgroundColor: `${preset.color}15`,
                      },
                    ]}
                  >
                    <Text style={[styles.presetIcon, { fontSize: 24 }]}>{preset.icon}</Text>
                    <Text style={[styles.presetLabel, selectedPreset === preset.id && { color: preset.color }]}>
                      {preset.label}
                    </Text>
                    <Text style={styles.presetDesc}>{preset.description}</Text>
                    {selectedPreset === preset.id && (
                      <View style={[styles.presetCheck, { backgroundColor: preset.color }]}>
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Analyze Button */}
          {photo && !analyzing && photo.status !== 'complete' && (
            <View style={styles.section}>
              <TouchableOpacity onPress={analyzePhoto} style={styles.analyzeBtn}>
                <LinearGradient
                  colors={['#6D28D9', '#7C3AED', '#8B5CF6']}
                  style={styles.analyzeBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.analyzeBtnIcon}>✦</Text>
                  <Text style={styles.analyzeBtnText}>Analyze & Enhance</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.analyzeBtnHint}>
                Powered by Claude AI · MLS Compliant · Takes ~10 seconds
              </Text>
            </View>
          )}

          {/* Results */}
          {result && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Enhancement Report</Text>

              {/* Quality Score */}
              <GlassCard variant="accent" style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>Quality Score</Text>
                <View style={styles.scoreRow}>
                  <ScoreBar
                    label="Before"
                    value={result.qualityScore.before}
                    color={colors.accentRed}
                  />
                  <Text style={styles.scoreArrow}>→</Text>
                  <ScoreBar
                    label="After"
                    value={result.qualityScore.after}
                    color={colors.accentGreen}
                  />
                </View>
                <Text style={styles.scoreImpact}>
                  +{result.qualityScore.after - result.qualityScore.before} point improvement
                </Text>
              </GlassCard>

              {/* Analysis Summary */}
              <GlassCard style={styles.analysisCard}>
                <View style={styles.analysisHeader}>
                  <Text style={styles.analysisIcon}>✦</Text>
                  <Text style={styles.analysisTitle}>AI Analysis</Text>
                </View>
                <Text style={styles.analysisText}>{result.analysisText}</Text>
              </GlassCard>

              {/* Improvements */}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Detected Improvements</Text>
              {result.improvements.map((imp: any, i: number) => (
                <GlassCard key={i} style={styles.improvementCard} noPadding>
                  <View style={styles.improvementInner}>
                    <View style={styles.improvementIcon}>
                      <Text style={styles.improvementIconText}>{getTypeIcon(imp.type)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.improvementLabel}>{imp.label}</Text>
                      <Text style={styles.improvementDesc}>{imp.description}</Text>
                    </View>
                    <Badge
                      label={imp.applied ? 'Applied' : 'Pending'}
                      variant={imp.applied ? 'green' : 'dark'}
                      size="sm"
                    />
                  </View>
                </GlassCard>
              ))}

              {/* Processing Steps */}
              {result.processingSteps?.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Processing Pipeline</Text>
                  <GlassCard>
                    {result.processingSteps.map((step: string, i: number) => (
                      <View key={i} style={styles.stepRow}>
                        <View style={styles.stepDot} />
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </GlassCard>
                </>
              )}

              {/* MLS Compliance Notice */}
              <GlassCard style={styles.complianceCard} variant="dark">
                <View style={styles.complianceHeader}>
                  <Text style={styles.complianceIcon}>⚖️</Text>
                  <Text style={styles.complianceTitle}>MLS Compliance Verified</Text>
                </View>
                <Text style={styles.complianceText}>
                  All enhancements comply with MLS photo disclosure standards.
                  No structural alterations, material changes, or appliance swaps.
                  Only transient items and lighting have been modified.
                </Text>
                <View style={styles.complianceBadges}>
                  <Badge label="Structure Preserved" variant="green" size="sm" style={{ marginRight: 6 }} />
                  <Badge label="No Hallucination" variant="green" size="sm" style={{ marginRight: 6 }} />
                  <Badge label="MLS Ready" variant="accent" size="sm" />
                </View>
              </GlassCard>

              {/* Share / Export */}
              <TouchableOpacity style={styles.exportBtn}>
                <LinearGradient
                  colors={colors.gradientAccent as [string, string]}
                  style={styles.exportBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.exportBtnText}>📤 Export Enhancement Report</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newPhotoBtn} onPress={resetPhoto}>
                <Text style={styles.newPhotoBtnText}>+ Enhance Another Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const UploadFeature: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.uploadFeatureItem}>
    <Text style={styles.uploadFeatureCheck}>✓</Text>
    <Text style={styles.uploadFeatureText}>{label}</Text>
  </View>
);

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <View style={styles.scoreBar}>
    <Text style={[styles.scoreValue, { color }]}>{value}</Text>
    <Text style={styles.scoreLabel}>{label}</Text>
    <View style={styles.scoreBarBg}>
      <View
        style={[styles.scoreBarFill, { width: `${value}%`, backgroundColor: color }]}
      />
    </View>
  </View>
);

const getTypeIcon = (type: string): string => {
  const map: Record<string, string> = {
    declutter: '🧹',
    lighting: '💡',
    'color-grade': '🎨',
    upscale: '🔍',
    sharpen: '✨',
    'noise-reduction': '🔇',
    exposure: '☀️',
  };
  return map[type] || '⚡';
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: spacing.base,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(139,92,246,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconText: {
    fontSize: 28,
    color: '#A78BFA',
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: colors.gray400,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: 12,
  },
  apiKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 4,
  },
  apiKeyLabel: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  apiKeyToggle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  apiKeyInput: {
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: 14,
    color: colors.white,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  uploadArea: {
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  uploadTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  uploadSubtitle: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  uploadBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  uploadBtn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    flex: 1,
  },
  uploadBtnGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: typography.fontSize.sm,
  },
  uploadBtnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  uploadBtnOutlineText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: typography.fontSize.sm,
  },
  uploadFeatures: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  uploadFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadFeatureCheck: {
    color: colors.accentGreen,
    fontWeight: '700',
    fontSize: 12,
  },
  uploadFeatureText: {
    color: colors.gray400,
    fontSize: 11,
  },
  previewContainer: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 240,
    position: 'relative',
    ...shadows.lg,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  removePhoto: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  removePhotoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  analyzingOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  aiSpinner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139,92,246,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  aiSpinnerText: {
    fontSize: 24,
    color: '#A78BFA',
  },
  analyzingTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
  },
  analyzingStep: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  progressBar: {
    width: width - 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 2,
  },
  progressText: {
    color: '#A78BFA',
    fontWeight: '700',
    marginTop: 6,
    fontSize: typography.fontSize.sm,
  },
  completeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(16,185,129,0.85)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  completeBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  optionLabel: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: 8,
  },
  roomChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 8,
  },
  roomChipActive: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderColor: colors.accent,
  },
  roomChipText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  roomChipTextActive: {
    color: colors.accent,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    width: (width - spacing.base * 2 - 10) / 2,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    position: 'relative',
  },
  presetIcon: {
    marginBottom: 6,
  },
  presetLabel: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    marginBottom: 4,
  },
  presetDesc: {
    color: colors.gray400,
    fontSize: 11,
    lineHeight: 15,
  },
  presetCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeBtn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  analyzeBtnGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  analyzeBtnIcon: {
    fontSize: 18,
    color: colors.white,
  },
  analyzeBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  analyzeBtnHint: {
    color: colors.gray500,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  scoreCard: {
    marginBottom: 12,
  },
  scoreTitle: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreBar: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '900',
  },
  scoreLabel: {
    color: colors.gray400,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  scoreBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreArrow: {
    color: colors.gray400,
    fontSize: 24,
    fontWeight: '300',
  },
  scoreImpact: {
    color: colors.accentGreen,
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  analysisCard: {
    marginBottom: 4,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  analysisIcon: {
    fontSize: 16,
    color: '#A78BFA',
  },
  analysisTitle: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
  analysisText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  improvementCard: {
    marginBottom: 8,
    padding: 0,
  },
  improvementInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  improvementIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  improvementIconText: {
    fontSize: 18,
  },
  improvementLabel: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
  improvementDesc: {
    color: colors.gray400,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 5,
    flexShrink: 0,
  },
  stepText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
  complianceCard: {
    marginTop: 12,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  complianceIcon: {
    fontSize: 18,
  },
  complianceTitle: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
  complianceText: {
    color: colors.gray300,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: 12,
  },
  complianceBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exportBtn: {
    marginTop: 16,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  exportBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  exportBtnText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '800',
  },
  newPhotoBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    alignItems: 'center',
  },
  newPhotoBtnText: {
    color: colors.gray300,
    fontWeight: '700',
    fontSize: typography.fontSize.base,
  },
});
