import { safeGet, safeSet } from './storage';
import { MEASUREMENT_ID, GTAG_DEBUG } from './config';
import { TRACKING_HISTORY } from './storage-keys';

/**
 * Analytics events that can be emitted by the application.
 */
export enum AnalyticsEvent {
  ShareFacebook = 'share_facebook',
  ShareTwitter = 'share_twitter',
  ShareWhatsapp = 'share_whatsapp',
  ShareTelegram = 'share_telegram',
  ShareNative = 'share_native',
  CopyLink = 'copy_link',
  HistoryEdit = 'history_edit',
  HistoryCopy = 'history_copy',
  HistoryPreview = 'history_preview',
  HistoryDeleteConfirm = 'history_delete_confirm',
  SettingsOpen = 'settings_open',
  ToggleHeaderButtons = 'toggle_header_buttons',
  ToggleLogo = 'toggle_logo',
  ToggleActionLabels = 'toggle_action_labels',
  PurgeCache = 'purge_cache',
  DisableTrackingConfirm = 'disable_tracking_confirm',
  ToggleTracking = 'toggle_tracking',
  EnableTrackingConfirm = 'enable_tracking_confirm',
  ScrollBottom = 'scroll_bottom',
  Stay3Min = 'stay_3min',
  Stay5Min = 'stay_5min',
  Stay10Min = 'stay_10min',
  Stay30Min = 'stay_30min',
  Stay60Min = 'stay_60min',
  CopyJson = 'copy_json',
  ClearJson = 'clear_json',
  ShareButton = 'share_button',
  SendToSora = 'send_to_sora',
  ImportButton = 'import_button',
  ResetButton = 'reset_button',
  RegenerateButton = 'regenerate_button',
  RandomizeButton = 'randomize_button',
  OptionsChange = 'options_change',
  InputChange = 'input_change',
  SelectedJsonPrompt = 'selected_json_prompt',
  HistoryImport = 'history_import',
  ClickSponsor = 'click_sponsor',
  SeeGithub = 'see_github',
  StarGithub = 'star_github',
  ForkGithub = 'fork_github',
  OpenIssues = 'open_issues',
  ViewOnLovable = 'view_on_lovable',
  InstallUserscript = 'install_userscript',
  UpdateUserscript = 'update_userscript',
  OpenDisclaimer = 'open_disclaimer',
  DarkModeToggle = 'dark_mode_toggle',
  PromptResize = 'prompt_resize',
  NegativePromptResize = 'negative_prompt_resize',
  HistoryOpen = 'history_open',
  HistoryViewPrompts = 'history_view_prompts',
  HistoryViewActions = 'history_view_actions',
  HistoryExport = 'history_export',
  DataExport = 'data_export',
  DataImport = 'data_import',
  HistoryImportOpen = 'history_import_open',
  HistoryExportClick = 'history_export_click',
  HistoryClearClick = 'history_clear_click',
  HistoryClearConfirm = 'history_clear_confirm',
  RestoreActions = 'restore_actions',
  JumpToJson = 'jump_to_json',
  MinimizeActions = 'minimize_actions',
  JsonChanged = 'json_changed',
  AppReload10 = 'app_reload_10',
  AppReload30 = 'app_reload_30',
  AppReload70 = 'app_reload_70',
  AppReload100 = 'app_reload_100',
  AppReload500 = 'app_reload_500',
  AppReload1000 = 'app_reload_1000',
  CopyJson10 = 'copy_json_10',
  CopyJson25 = 'copy_json_25',
  CopyJson50 = 'copy_json_50',
  CopyJson100 = 'copy_json_100',
  CopyJson200 = 'copy_json_200',
  CopyJson500 = 'copy_json_500',
  CopyJson1000 = 'copy_json_1000',
  CopyJson2000 = 'copy_json_2000',
  CopyJson5000 = 'copy_json_5000',
  CopyJson10000 = 'copy_json_10000',
  Time5Min = 'time_5min',
  Time10Min = 'time_10min',
  Time30Min = 'time_30min',
  Time1Hour = 'time_1h',
  Time3Hour = 'time_3h',
  Time8Hour = 'time_8h',
  Time12Hour = 'time_12h',
  Time2Day = 'time_2d',
  Time4Day = 'time_4d',
  Time7Day = 'time_7d',
  Time2Week = 'time_2w',
  Time4Week = 'time_4w',
  Time2Month = 'time_2m',
  Time4Month = 'time_4m',
  Time8Month = 'time_8m',
}

let trackingFailures = 0;
let trackingDead = false;
let gtagMissingLogged = false;

/**
 * Record an analytics event and update local tracking history.
 *
 * @param enabled - When `false`, the function returns without taking action.
 * @param event - The specific {@link AnalyticsEvent} being tracked.
 * @param params - Optional additional data to include with the event.
 *
 * @remarks
 * Side effects:
 * - Updates the `TRACKING_HISTORY` key in storage and dispatches a
 *   `trackingHistoryUpdate` event on `window`.
 * - Sends the event to the global `gtag` function if available.
 * - Logs errors and permanently disables tracking after repeated failures.
 */
export function trackEvent(
  enabled: boolean,
  event: AnalyticsEvent,
  params?: Record<string, unknown>,
) {
  if (!enabled) return;

  try {
    const list = safeGet<{ date: string; action: string }[]>(
      TRACKING_HISTORY,
      [],
      true,
    ) as { date: string; action: string }[];
    list.unshift({ date: new Date().toLocaleString(), action: event });
    if (list.length > 100) list.length = 100;
    if (!safeSet(TRACKING_HISTORY, list, true)) throw new Error('fail');
    window.dispatchEvent(new Event('trackingHistoryUpdate'));
  } catch {
    console.error('Tracking History: There was an error.');
  }

  if (trackingDead) return;

  const gtag = (
    window as unknown as {
      gtag?: (
        action: string,
        eventName: string,
        params?: Record<string, unknown>,
      ) => void;
    }
  ).gtag;

  if (typeof gtag !== 'function') {
    if (!gtagMissingLogged) {
      console.warn('Tracking Analytics: gtag function missing.');
      gtagMissingLogged = true;
    }
    return;
  }

  try {
    const eventParams: Record<string, unknown> = {
      send_to: MEASUREMENT_ID,
      action: event,
      ...params,
    };
    if (GTAG_DEBUG) {
      eventParams.debug_mode = true;
      console.debug('gtag event', event, params);
    }
    gtag('event', event, eventParams);
  } catch (e) {
    trackingFailures++;
    if (trackingFailures <= 5) {
      console.error('Tracking Analytics: There was an error.');
    }
    if (trackingFailures > 5 && !trackingDead) {
      trackingDead = true;
      console.error(
        'Tracking Analytics: Too many errors, tracking permanently failed.',
      );
    }
  }
}
