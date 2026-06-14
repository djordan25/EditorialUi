import {
    forwardRef,
    useEffect,
    useRef,
    useState,
    type FocusEvent,
    type ReactNode,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { EdTextField, type EdTextFieldProps } from '../EdTextField';
import { EdIconButton } from '../EdIconButton';
import styles from './EdPasswordInput.module.scss';

export type EdPasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface EdPasswordStrengthInfo {
    /** Band — drives segment count and color. */
    band: EdPasswordStrength;
    /** Short caption read by screen readers via aria-live. */
    caption: ReactNode;
}

export interface EdPasswordInputProps
    extends Omit<EdTextFieldProps, 'type' | 'suffix' | 'mono'> {
    /**
     * Allow the user to toggle masking. Disabled by default — at sign-in the
     * user already knows their password, and the toggle is a shoulder-surf risk.
     * Enable for change-password / reset-password flows.
     */
    revealable?: boolean;
    /**
     * Auto-mask back to dots after this many ms of being revealed. Default 30000.
     * Pass 0 to disable auto-mask. Has no effect when `revealable` is false.
     */
    revealTimeoutMs?: number;
    /**
     * Optional strength info to render below the control. Use on NEW-password screens
     * only — never on sign-in (it leaks information). Caller computes the band
     * (e.g. via zxcvbn) and passes the result in.
     */
    strength?: EdPasswordStrengthInfo;
}

const segmentCount: Record<EdPasswordStrength, number> = {
    weak: 1,
    fair: 2,
    good: 3,
    strong: 4,
};

const segmentClass: Record<EdPasswordStrength, string> = {
    weak: styles.segLow,
    fair: styles.segMid,
    good: styles.segMid,
    strong: styles.segHigh,
};

const captionClass: Record<EdPasswordStrength, string> = {
    weak: styles.captionLow,
    fair: styles.captionMid,
    good: styles.captionMid,
    strong: styles.captionHigh,
};

/**
 * EdPasswordInput — EdTextField specialised for password capture.
 * Adds a reveal toggle (opt-in) and a strength-meter slot. The meter is
 * informational only — server-side policy is the source of truth.
 *
 *   <EdPasswordInput label="Password" autoComplete="current-password" />
 *   <EdPasswordInput
 *     label="New password"
 *     revealable
 *     strength={{ band: 'fair', caption: 'Fair · 12+ characters recommended' }}
 *   />
 */
export const EdPasswordInput = forwardRef<HTMLInputElement, EdPasswordInputProps>(
    function EdPasswordInput(
        {
            revealable = false,
            revealTimeoutMs = 30_000,
            strength,
            onBlur,
            ...rest
        },
        ref,
    ) {
        const [revealed, setRevealed] = useState(false);
        const timeoutRef = useRef<number | undefined>(undefined);

        // Auto-mask on a timer once revealed.
        useEffect(() => {
            if (!revealed || !revealTimeoutMs) return;
            const id = window.setTimeout(() => setRevealed(false), revealTimeoutMs);
            timeoutRef.current = id;
            return () => window.clearTimeout(id);
        }, [revealed, revealTimeoutMs]);

        // Re-mask when focus leaves the whole control (input + reveal toggle) —
        // safer default than persisting a revealed value once the user moves on.
        // Tied to the container, not the input, so clicking the toggle (which the
        // input is not focused for) doesn't prematurely re-mask.
        const handleContainerBlur = (e: FocusEvent<HTMLDivElement>) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setRevealed(false);
            }
        };

        const toggle = revealable ? (
            <EdIconButton
                aria-label={revealed ? 'Hide password' : 'Show password'}
                size="sm"
                icon={revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                onClick={() => setRevealed((v) => !v)}
                tabIndex={-1} /* keep tab order focused on the input */
            />
        ) : undefined;

        return (
            <div className={styles.root} onBlur={handleContainerBlur}>
                <EdTextField
                    {...rest}
                    ref={ref}
                    type={revealed ? 'text' : 'password'}
                    autoComplete={rest.autoComplete ?? 'current-password'}
                    mono={revealed}
                    suffix={toggle}
                    onBlur={onBlur}
                />
                {strength && (
                    <div className={styles.meterWrap}>
                        <div
                            className={styles.meter}
                            role="progressbar"
                            aria-label="Password strength"
                            aria-valuemin={0}
                            aria-valuemax={4}
                            aria-valuenow={segmentCount[strength.band]}
                            aria-valuetext={strength.band}
                        >
                            {[0, 1, 2, 3].map((i) => (
                                <span
                                    key={i}
                                    className={[
                                        styles.seg,
                                        i < segmentCount[strength.band] && segmentClass[strength.band],
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                />
                            ))}
                        </div>
                        <p
                            className={[styles.caption, captionClass[strength.band]]
                                .filter(Boolean)
                                .join(' ')}
                            aria-live="polite"
                        >
                            {strength.caption}
                        </p>
                    </div>
                )}
            </div>
        );
    },
);
