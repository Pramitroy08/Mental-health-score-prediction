import { useEffect, useMemo, useRef, useState } from "react";

const TOP_COUNTRIES = [
  "India",
  "USA",
  "Canada",
  "Australia",
  "UK",
  "Germany",
  "Mexico",
  "Turkey",
  "France",
  "Other",
];

const PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Snapchat",
  "Twitter",
  "LinkedIn",
  "WhatsApp",
  "WeChat",
  "LINE",
  "KakaoTalk",
  "VKontakte",
];

const PURPOSES = [
  "Entertainment",
  "Education",
  "Networking",
  "News",
];

const ACADEMIC_LEVELS = [
  "High School",
  "Undergraduate",
  "Graduate",
];

const STRESS_LEVELS = [
  "Low",
  "Medium",
  "High",
  "Very High",
];

const STRESS_HINT = {
  Low: "Rarely feels overwhelmed",
  Medium: "Occasional pressure, manageable",
  High: "Frequently under pressure",
  "Very High": "Persistent, heavy pressure",
};

function Chevron() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5.5L7 9.5L11 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 14.8A8.5 8.5 0 0 1 9.2 3a8.5 8.5 0 1 0 11.8 11.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.7 8.3L20 10L13.7 11.7L12 18L10.3 11.7L4 10L10.3 8.3L12 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12H7L9.5 5L14 19L16.5 12H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({ index, label, hint, children }) {
  return (
    <div className="field">
      <div className="field-label-row">
        {index != null && (
          <span className="field-index">
            {index}
          </span>
        )}

        <label className="field-label">
          {label}
        </label>
      </div>

      {children}

      {hint && (
        <p className="field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

function SelectField({
  index,
  label,
  value,
  onChange,
  options,
  hint,
}) {
  return (
    <Field
      index={index}
      label={label}
      hint={hint}
    >
      <div className="select-wrap">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <span className="select-chevron">
          <Chevron />
        </span>
      </div>
    </Field>
  );
}

function SliderField({
  index,
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}) {
  const pct =
    ((value - min) / (max - min)) * 100;

  return (
    <Field
      index={index}
      label={label}
    >
      <div className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(
              parseFloat(e.target.value)
            )
          }
          style={{
            "--fill": `${pct}%`,
          }}
        />

        <span className="slider-readout">
          {value}
          {unit}
        </span>
      </div>
    </Field>
  );
}

function StepperField({
  index,
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}) {
  const dec = () =>
    onChange(
      Math.max(min, value - step)
    );

  const inc = () =>
    onChange(value + step);

  return (
    <Field
      index={index}
      label={label}
    >
      <div className="stepper">
        <button
          type="button"
          className="stepper-btn"
          onClick={dec}
          aria-label="Decrease"
        >
          −
        </button>

        <input
          type="number"
          value={value}
          min={min}
          onChange={(e) =>
            onChange(
              Math.max(
                min,
                parseInt(
                  e.target.value || "0",
                  10
                )
              )
            )
          }
        />

        <button
          type="button"
          className="stepper-btn"
          onClick={inc}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </Field>
  );
}

function Gauge({ score }) {
  const clamped =
    score == null
      ? 0
      : Math.max(
          0,
          Math.min(10, score)
        );

  const angle =
    -90 + (clamped / 10) * 180;

  const cx = 110;
  const cy = 110;
  const r = 86;

  const describeArc = (
    startDeg,
    endDeg
  ) => {
    const toXY = (deg) => {
      const rad =
        ((deg - 90) * Math.PI) /
        180;

      return [
        cx + r * Math.cos(rad),
        cy + r * Math.sin(rad),
      ];
    };

    const [x1, y1] =
      toXY(startDeg);

    const [x2, y2] =
      toXY(endDeg);

    const large =
      endDeg - startDeg <= 180
        ? 0
        : 1;

    return `M ${x1} ${y1}
      A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <svg
      viewBox="0 0 220 140"
      className="gauge"
      role="img"
      aria-label={
        score == null
          ? "No score yet"
          : `Score ${clamped.toFixed(2)} out of 10`
      }
    >
      <defs>
        <linearGradient
          id="arcGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="#D95C48"
          />

          <stop
            offset="50%"
            stopColor="#D2A143"
          />

          <stop
            offset="100%"
            stopColor="#4E9B83"
          />
        </linearGradient>
      </defs>

      <path
        d={describeArc(0, 180)}
        fill="none"
        stroke="var(--gauge-track)"
        strokeWidth="14"
        strokeLinecap="round"
      />

      <path
        d={describeArc(0, 180)}
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity={
          score == null ? 0.25 : 1
        }
      />

      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
        className="needle-group"
      >
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r + 18}
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill="var(--ink)"
      />

      <circle
        cx={cx}
        cy={cy}
        r="3"
        fill="var(--panel)"
      />
    </svg>
  );
}

export default function MentalHealthPredictor() {
  const [apiUrl, setApiUrl] =
    useState("https://mental-health-score-prediction-backend.onrender.com");
    

  const [theme, setTheme] =
    useState(() => {
      return (
        localStorage.getItem(
          "mindmetric-theme"
        ) || "light"
      );
    });

  const [form, setForm] = useState({
    age: 21,
    gender: "Female",
    countrySel: "India",
    countryCustom: "",
    academic_level:
      "Undergraduate",
    most_used_platform:
      "Instagram",
    purpose_of_use:
      "Entertainment",
    avg_daily_usage_hours: 4,
    daily_unlocks: 50,
    study_hours: 3,
    physical_activity_hours: 1,
    sleep_hours_per_night: 7,
    stress_level: "Medium",
  });

  const [status, setStatus] =
    useState("idle");

  const [result, setResult] =
    useState(null);

  const [errorMsg, setErrorMsg] =
    useState("");

  const resultRef =
    useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "mindmetric-theme",
      theme
    );
  }, [theme]);

  const set = (key) => (value) =>
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

  const country =
    form.countrySel === "Other"
      ? form.countryCustom || "Other"
      : form.countrySel;

  const descriptor =
    useMemo(() => {
      if (result == null)
        return null;

      if (result <= 3)
        return "On the lower end of the scale";

      if (result <= 6)
        return "Middling — room to shift either way";

      return "On the higher end of the scale";
    }, [result]);

  const resultLabel =
    useMemo(() => {
      if (result == null)
        return "Awaiting prediction";

      if (result <= 3)
        return "Lower range";

      if (result <= 6)
        return "Middle range";

      return "Higher range";
    }, [result]);

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus("loading");
    setErrorMsg("");

    const payload = {
      age: form.age,
      gender: form.gender,
      country,
      academic_level:
        form.academic_level,
      most_used_platform:
        form.most_used_platform,
      purpose_of_use:
        form.purpose_of_use,
      avg_daily_usage_hours:
        form.avg_daily_usage_hours,
      daily_unlocks:
        form.daily_unlocks,
      study_hours:
        form.study_hours,
      physical_activity_hours:
        form.physical_activity_hours,
      sleep_hours_per_night:
        form.sleep_hours_per_night,
      stress_level:
        form.stress_level,
    };

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text =
          await res.text();

        throw new Error(
          text ||
            `Request failed with status ${res.status}`
        );
      }

      const data =
        await res.json();

      setResult(
        Number(
          data.predicted_mental_health_score
        )
      );

      setStatus("done");

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    } catch (err) {
      setStatus("error");

      setErrorMsg(
        err.message ||
          "Could not reach the API."
      );
    }
  }

  return (
    <div className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <style>{`
        :root {
          --paper: #eef1ea;
          --panel: rgba(250, 251, 247, 0.82);
          --panel-solid: #f9faf6;
          --ink: #17231c;
          --ink-soft: #657269;
          --pine: #397766;
          --pine-deep: #245347;
          --line: #d4dbd0;
          --input: rgba(255,255,255,0.82);
          --hover: #edf3ed;
          --gauge-track: #dce3d9;
          --shadow: 0 20px 60px rgba(34, 57, 46, 0.08);
          --shadow-hover: 0 25px 70px rgba(34, 57, 46, 0.14);
        }

        :root[data-theme="dark"] {
          --paper: #101714;
          --panel: rgba(23, 32, 27, 0.86);
          --panel-solid: #17201b;
          --ink: #eef4ed;
          --ink-soft: #aab8ad;
          --pine: #65b39c;
          --pine-deep: #8acbb6;
          --line: #334139;
          --input: rgba(18, 25, 21, 0.9);
          --hover: #202c25;
          --gauge-track: #35433b;
          --shadow: 0 20px 70px rgba(0, 0, 0, 0.25);
          --shadow-hover: 0 30px 80px rgba(0, 0, 0, 0.4);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--paper);
        }

        .page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(82, 151, 126, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(206, 168, 83, 0.09),
              transparent 25%
            ),
            var(--paper);
          color: var(--ink);
          font-family:
            "IBM Plex Sans",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
          transition:
            background 0.35s ease,
            color 0.35s ease;
        }

        .ambient {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.16;
          pointer-events: none;
          animation:
            floatAmbient 10s ease-in-out infinite;
        }

        .ambient-one {
          background: var(--pine);
          top: 500px;
          left: -180px;
        }

        .ambient-two {
          background: #c89a42;
          top: 100px;
          right: -180px;
          animation-delay: -4s;
        }

        @keyframes floatAmbient {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-35px);
          }
        }

        .nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1160px;
          margin: 0 auto;
          padding: 24px 28px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .brand-mark {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: var(--pine);
          color: white;
          box-shadow:
            0 8px 22px
            rgba(57,119,102,0.25);
          animation:
            brandFloat 4s ease-in-out infinite;
        }

        @keyframes brandFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        .brand span {
          color: var(--pine);
          font-style: italic;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .nav-note {
          font-size: 13px;
          color: var(--ink-soft);
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          background: var(--panel);
          color: var(--ink);
          border-radius: 999px;
          padding: 7px 12px;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          background: var(--hover);
          box-shadow:
            0 8px 25px
            rgba(40,70,55,0.12);
        }

        .theme-toggle:active {
          transform: scale(0.96);
        }

        .theme-label {
          font-size: 12px;
          font-weight: 500;
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px 80px;
        }

        .hero {
          padding: 48px 0 62px;
          animation:
            heroReveal 0.8s
            cubic-bezier(.22,1,.36,1);
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 7px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--pine);
          background:
            color-mix(
              in srgb,
              var(--panel) 85%,
              transparent
            );
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--pine);
          box-shadow:
            0 0 0 5px
            color-mix(
              in srgb,
              var(--pine) 12%,
              transparent
            );
        }

        .hero h1 {
          max-width: 780px;
          margin: 0 0 20px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size:
            clamp(42px, 6vw, 72px);
          line-height: 1.02;
          font-weight: 500;
          letter-spacing: -1.5px;
        }

        .hero h1 em {
          color: var(--pine);
          font-style: italic;
        }

        .hero p {
          max-width: 650px;
          margin: 0;
          color: var(--ink-soft);
          font-size: 16px;
          line-height: 1.7;
        }

        .layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.35fr)
            minmax(320px, 0.85fr);
          gap: 34px;
          align-items: start;
        }

        .form-sheet {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 10px 34px 34px;
          box-shadow: var(--shadow);
          backdrop-filter: blur(18px);
          transition:
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .form-sheet:hover {
          box-shadow: var(--shadow-hover);
        }

        .section {
          padding: 28px 0;
          border-bottom: 1px solid var(--line);
          animation:
            sectionReveal 0.7s both;
        }

        .section:nth-child(2) {
          animation-delay: .08s;
        }

        .section:nth-child(3) {
          animation-delay: .14s;
        }

        .section:nth-child(4) {
          animation-delay: .20s;
        }

        .section:nth-child(5) {
          animation-delay: .26s;
        }

        @keyframes sectionReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 20px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--pine-deep);
        }

        .section-title::before {
          content: "";
          width: 4px;
          height: 22px;
          border-radius: 10px;
          background: var(--pine);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px 24px;
        }

        .field {
          margin-bottom: 4px;
        }

        .field-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 9px;
        }

        .field-index {
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--line);
          border-radius: 50%;
          color: var(--ink-soft);
          font-size: 10px;
          font-weight: 500;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .field:hover .field-index {
          background: var(--pine);
          color: white;
          border-color: var(--pine);
          transform: scale(1.08);
        }

        .field-label {
          color: var(--ink);
          font-size: 13.5px;
          font-weight: 600;
        }

        .field-hint {
          margin: 7px 0 0;
          color: var(--ink-soft);
          font-size: 12px;
        }

        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid var(--line);
          border-radius: 9px;
          background: var(--input);
          color: var(--ink);
          font-family:
            "IBM Plex Sans",
            sans-serif;
          font-size: 14px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease,
            background 0.2s ease;
        }

        input[type="text"]:hover,
        input[type="number"]:hover,
        select:hover {
          border-color: var(--pine);
          transform: translateY(-1px);
        }

        input:focus-visible,
        select:focus-visible {
          outline: none;
          border-color: var(--pine);
          box-shadow:
            0 0 0 4px
            color-mix(
              in srgb,
              var(--pine) 15%,
              transparent
            );
        }

        .select-wrap {
          position: relative;
        }

        .select-wrap select {
          appearance: none;
          padding-right: 38px;
          cursor: pointer;
        }

        .select-chevron {
          position: absolute;
          right: 13px;
          top: 50%;
          transform:
            translateY(-50%);
          color: var(--ink-soft);
          pointer-events: none;
          transition:
            transform 0.2s ease;
        }

        .select-wrap:hover .select-chevron {
          transform:
            translateY(-50%)
            translateY(1px);
        }

        .slider-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        input[type="range"] {
          flex: 1;
          height: 5px;
          appearance: none;
          -webkit-appearance: none;
          border-radius: 10px;
          background:
            linear-gradient(
              to right,
              var(--pine) 0%,
              var(--pine) var(--fill, 0%),
              var(--line) var(--fill, 0%),
              var(--line) 100%
            );
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: var(--pine);
          border: 3px solid var(--panel-solid);
          box-shadow:
            0 0 0 1px var(--pine),
            0 3px 10px rgba(40,90,70,.22);
          transition:
            transform 0.2s ease;
        }

        input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.18);
        }

        input[type="range"]::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--pine);
          border: 2px solid var(--panel-solid);
        }

        .slider-readout {
          min-width: 45px;
          text-align: right;
          color: var(--pine-deep);
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric:
            tabular-nums;
        }

        .stepper {
          display: inline-flex;
          align-items: stretch;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 9px;
          background: var(--input);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .stepper:hover {
          border-color: var(--pine);
          box-shadow:
            0 5px 18px
            rgba(40,90,70,.08);
        }

        .stepper input[type="number"] {
          width: 70px;
          text-align: center;
          border: none;
          border-left: 1px solid var(--line);
          border-right: 1px solid var(--line);
          border-radius: 0;
          background: transparent;
        }

        .stepper input[type="number"]::-webkit-inner-spin-button {
          appearance: none;
        }

        .stepper-btn {
          width: 40px;
          border: none;
          background: transparent;
          color: var(--pine-deep);
          font-size: 17px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.15s ease;
        }

        .stepper-btn:hover {
          background: var(--hover);
        }

        .stepper-btn:active {
          transform: scale(.9);
        }

        .api-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 7px 10px;
          border: 1px dashed var(--line);
          border-radius: 10px;
          background:
            color-mix(
              in srgb,
              var(--input) 70%,
              transparent
            );
        }

        .api-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ink-soft);
          font-size: 11px;
          white-space: nowrap;
        }

        .api-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--pine);
          animation:
            pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: .35;
          }
        }

        .api-row label {
          color: var(--ink-soft);
          font-size: 11px;
          white-space: nowrap;
        }

        .api-row input {
          min-width: 0;
          padding: 5px 7px;
          border: none;
          background: transparent;
          color: var(--ink-soft);
          font-size: 12px;
        }

        .api-row input:focus {
          box-shadow: none;
        }

        .submit-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-top: 27px;
          flex-wrap: wrap;
        }

        .submit-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          overflow: hidden;
          padding: 13px 22px;
          border: none;
          border-radius: 10px;
          background: var(--pine);
          color: white;
          font-family:
            "IBM Plex Sans",
            sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow:
            0 10px 25px
            rgba(57,119,102,.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 70%;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.25),
              transparent
            );
          transition:
            left .6s ease;
        }

        .submit-btn:hover {
          transform:
            translateY(-2px);
          box-shadow:
            0 15px 32px
            rgba(57,119,102,.32);
          background:
            var(--pine-deep);
        }

        .submit-btn:hover::before {
          left: 130%;
        }

        .submit-btn:active {
          transform:
            translateY(0)
            scale(.98);
        }

        .submit-btn:disabled {
          opacity: .65;
          cursor: wait;
        }

        .loading-dot {
          width: 14px;
          height: 14px;
          border:
            2px solid rgba(255,255,255,.35);
          border-top-color: white;
          border-radius: 50%;
          animation:
            spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-msg {
          max-width: 42ch;
          color: #c95343;
          font-size: 12.5px;
          line-height: 1.5;
        }

        .result-panel {
          position: sticky;
          top: 24px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--panel);
          padding: 30px 28px 25px;
          text-align: center;
          box-shadow: var(--shadow);
          backdrop-filter: blur(20px);
          transition:
            box-shadow .3s ease,
            transform .3s ease;
        }

        .result-panel::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background:
            color-mix(
              in srgb,
              var(--pine) 13%,
              transparent
            );
          filter: blur(30px);
          top: -90px;
          right: -70px;
          pointer-events: none;
        }

        .result-panel:hover {
          transform:
            translateY(-3px);
          box-shadow:
            var(--shadow-hover);
        }

        .result-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-bottom: 4px;
        }

        .result-icon {
          color: var(--pine);
        }

        .result-eyebrow {
          margin: 0;
          color: var(--ink-soft);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .result-title {
          margin: 2px 0 0;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 21px;
          font-weight: 500;
          color: var(--ink);
        }

        .score-area {
          position: relative;
          margin-top: 8px;
        }

        .gauge {
          display: block;
          width: 100%;
          max-width: 270px;
          margin: 4px auto -3px;
        }

        .needle-group {
          transition:
            transform 1.2s
            cubic-bezier(
              .22,
              1,
              .36,
              1
            );
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .needle-group {
            transition: none;
          }
        }

        .score-number {
          margin: 0 0 3px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 52px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: -1px;
          color: var(--ink);
        }

        .score-number.animate {
          animation:
            scorePop .65s
            cubic-bezier(
              .22,
              1,
              .36,
              1
            );
        }

        @keyframes scorePop {
          from {
            opacity: 0;
            transform:
              translateY(12px)
              scale(.85);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .of10 {
          font-family:
            "IBM Plex Sans",
            sans-serif;
          font-size: 18px;
          color: var(--ink-soft);
          font-weight: 400;
          letter-spacing: 0;
        }

        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background:
            color-mix(
              in srgb,
              var(--pine) 10%,
              transparent
            );
          color: var(--pine-deep);
          font-size: 11px;
          font-weight: 600;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--pine);
          animation: pulseDot 2s infinite;
        }

        .score-descriptor {
          margin: 7px 0 13px;
          color: var(--pine-deep);
          font-size: 13px;
        }

        .insight-content {
          margin-top: 20px;
          animation:
            insightReveal .65s
            cubic-bezier(.22,1,.36,1);
        }

        @keyframes insightReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .insight-intro {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 14px;
          text-align: left;
          border: 1px solid var(--line);
          border-radius: 12px;
          background:
            color-mix(
              in srgb,
              var(--pine) 5%,
              var(--panel-solid)
            );
        }

        .intro-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background:
            color-mix(
              in srgb,
              var(--pine) 12%,
              transparent
            );
          color: var(--pine);
          animation:
            iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        .insight-intro h4 {
          margin: 0 0 5px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 16px;
          font-weight: 600;
        }

        .insight-intro p {
          margin: 0;
          color: var(--ink-soft);
          font-size: 11.5px;
          line-height: 1.55;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .insight-card {
          position: relative;
          overflow: hidden;
          padding: 13px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--panel-solid);
          text-align: left;
          transition:
            transform .25s ease,
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .insight-card::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background:
            color-mix(
              in srgb,
              var(--pine) 7%,
              transparent
            );
          top: -35px;
          right: -35px;
          transition:
            transform .3s ease;
        }

        .insight-card:hover {
          transform:
            translateY(-4px);
          border-color: var(--pine);
          box-shadow:
            0 12px 25px
            rgba(40,90,70,.10);
        }

        .insight-card:hover::after {
          transform: scale(1.6);
        }

        .insight-card-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
        }

        .insight-card-icon {
          color: var(--pine);
          font-size: 16px;
        }

        .insight-card-label {
          color: var(--ink-soft);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .07em;
        }

        .insight-card strong {
          display: block;
          position: relative;
          z-index: 1;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 22px;
          line-height: 1;
        }

        .insight-card p {
          position: relative;
          z-index: 1;
          margin: 4px 0 9px;
          color: var(--ink-soft);
          font-size: 9.5px;
        }

        .mini-progress {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 4px;
          overflow: hidden;
          border-radius: 99px;
          background: var(--line);
        }

        .mini-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--pine);
          transition:
            width .7s
            cubic-bezier(.22,1,.36,1);
        }

        .stress-indicator {
          display: flex;
          gap: 4px;
          margin-top: 10px;
        }

        .stress-indicator span {
          flex: 1;
          height: 4px;
          border-radius: 10px;
          background: var(--line);
          transition:
            background .3s ease,
            transform .3s ease;
        }

        .stress-indicator span.active {
          background: var(--pine);
        }

        .stress-indicator span.danger {
          background: #c95343;
        }

        .model-observation {
          margin-top: 11px;
          padding: 12px 13px;
          border-radius: 12px;
          background:
            color-mix(
              in srgb,
              var(--hover) 75%,
              transparent
            );
          text-align: left;
        }

        .observation-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--pine);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .09em;
        }

        .observation-line {
          flex: 1;
          height: 1px;
          background: var(--line);
        }

        .model-observation p {
          margin: 7px 0 0;
          color: var(--ink-soft);
          font-size: 10.5px;
          line-height: 1.55;
        }

        .model-observation b {
          color: var(--ink);
          font-weight: 600;
        }

        .action-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 10px;
          padding: 13px;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              color-mix(
                in srgb,
                var(--pine) 11%,
                var(--panel-solid)
              ),
              var(--panel-solid)
            );
          border: 1px solid
            color-mix(
              in srgb,
              var(--pine) 25%,
              var(--line)
            );
          text-align: left;
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .action-card:hover {
          transform:
            translateY(-3px);
          box-shadow:
            0 12px 25px
            rgba(40,90,70,.10);
        }

        .action-icon {
          display: grid;
          place-items: center;
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          border-radius: 8px;
          background: var(--pine);
          color: white;
          font-size: 13px;
          animation:
            actionPulse 3s ease-in-out infinite;
        }

        @keyframes actionPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0
              rgba(57,119,102,.2);
          }

          50% {
            box-shadow:
              0 0 0 7px
              rgba(57,119,102,0);
          }
        }

        .action-card h4 {
          margin: 0 0 4px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 15px;
        }

        .action-card p {
          margin: 0;
          color: var(--ink-soft);
          font-size: 10.5px;
          line-height: 1.55;
        }

        .empty-insight {
          padding: 22px 10px 5px;
          animation:
            emptyReveal .7s
            cubic-bezier(.22,1,.36,1);
        }

        @keyframes emptyReveal {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .empty-orbit {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 8px auto 18px;
        }

        .orbit-ring {
          position: absolute;
          inset: 0;
          border: 1px solid
            color-mix(
              in srgb,
              var(--pine) 25%,
              transparent
            );
          border-radius: 50%;
        }

        .ring-one {
          animation:
            orbitSpin 9s linear infinite;
        }

        .ring-two {
          inset: 15px;
          border-style: dashed;
          animation:
            orbitSpin 6s linear infinite reverse;
        }

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .orbit-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background:
            color-mix(
              in srgb,
              var(--pine) 12%,
              var(--panel-solid)
            );
          color: var(--pine);
          box-shadow:
            0 10px 30px
            rgba(57,119,102,.12);
          animation:
            centerFloat 3s ease-in-out infinite;
        }

        @keyframes centerFloat {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              scale(1);
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.08);
          }
        }

        .empty-insight h3 {
          margin: 0 0 7px;
          font-family:
            "Newsreader",
            Georgia,
            serif;
          font-size: 23px;
          font-weight: 500;
        }

        .empty-insight > p {
          max-width: 34ch;
          margin: 0 auto 20px;
          color: var(--ink-soft);
          font-size: 12px;
          line-height: 1.6;
        }

        .empty-points {
          display: grid;
          gap: 8px;
          text-align: left;
        }

        .empty-points div {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 10px;
          color: var(--ink-soft);
          font-size: 10.5px;
          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .empty-points div:hover {
          transform: translateX(4px);
          border-color: var(--pine);
          background: var(--hover);
        }

        .empty-points span {
          color: var(--pine);
          font-size: 9px;
          font-weight: 700;
        }

        .disclaimer {
          margin: 20px 0 0;
          padding: 14px 2px 0;
          border-top: 1px solid var(--line);
          color: var(--ink-soft);
          font-size: 11px;
          line-height: 1.65;
          text-align: left;
        }

        footer.foot {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 36px 0 0;
          color: var(--ink-soft);
          font-size: 11.5px;
        }

        .footer-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--pine);
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .result-panel {
            position: relative;
            top: auto;
            max-width: 650px;
            margin: 0 auto;
            width: 100%;
          }

          .hero {
            padding-top: 30px;
          }
        }

        @media (max-width: 650px) {
          .nav {
            padding: 18px 18px;
          }

          .nav-note {
            display: none;
          }

          .container {
            padding: 0 16px 60px;
          }

          .hero {
            padding: 32px 0 40px;
          }

          .hero h1 {
            font-size: 42px;
            letter-spacing: -1px;
          }

          .form-sheet {
            padding: 5px 20px 24px;
            border-radius: 14px;
          }

          .grid-2 {
            grid-template-columns: 1fr;
          }

          .insight-grid {
            grid-template-columns: 1fr 1fr;
          }

          .api-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .api-row input {
            width: 100%;
          }

          .theme-label {
            display: none;
          }

          .theme-toggle {
            width: 36px;
            height: 36px;
            padding: 0;
            justify-content: center;
          }
        }

        @media (max-width: 420px) {
          .insight-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="brand">
          <div className="brand-mark">
            <ActivityIcon />
          </div>

          <div>
            <span>Mind</span>Metric
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-note">
            Social media & wellbeing estimator
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme(
                theme === "light"
                  ? "dark"
                  : "light"
              )
            }
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}

            <span className="theme-label">
              {theme === "light"
                ? "Dark"
                : "Light"}
            </span>
          </button>
        </div>
      </nav>

      <div className="container">
        <section className="hero">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <SparkleIcon />
            Personal wellbeing insight
          </div>

          <h1>
            How does your{" "}
            <em>screen time</em>{" "}
            sit alongside your wellbeing?
          </h1>

          <p>
            Answer a few honest questions
            about your habits, studies,
            lifestyle and stress. Our
            machine-learning model will
            estimate your wellbeing score
            on a scale of 0–10.
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="layout">
            <div className="form-sheet">
              <div className="section">
                <div className="api-row">
                  <div className="api-status">
                    <span className="api-dot" />
                    API
                  </div>

                  <label htmlFor="apiUrl">
                    Endpoint
                  </label>

                  <input
                    id="apiUrl"
                    type="text"
                    value={apiUrl}
                    onChange={(e) =>
                      setApiUrl(
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">
                  About you
                </h2>

                <div className="grid-2">
                  <StepperField
                    index={1}
                    label="Age"
                    value={form.age}
                    min={10}
                    onChange={set("age")}
                  />

                  <SelectField
                    index={2}
                    label="Gender"
                    value={form.gender}
                    onChange={set("gender")}
                    options={[
                      "Male",
                      "Female",
                    ]}
                  />

                  <SelectField
                    index={3}
                    label="Country"
                    value={
                      form.countrySel
                    }
                    onChange={set(
                      "countrySel"
                    )}
                    options={
                      TOP_COUNTRIES
                    }
                  />

                  {form.countrySel ===
                    "Other" && (
                    <Field
                      label="Which country?"
                    >
                      <input
                        type="text"
                        value={
                          form.countryCustom
                        }
                        onChange={(e) =>
                          set(
                            "countryCustom"
                          )(
                            e.target.value
                          )
                        }
                        placeholder="Type your country"
                      />
                    </Field>
                  )}

                  <SelectField
                    index={4}
                    label="Academic level"
                    value={
                      form.academic_level
                    }
                    onChange={set(
                      "academic_level"
                    )}
                    options={
                      ACADEMIC_LEVELS
                    }
                  />
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">
                  Digital habits
                </h2>

                <div className="grid-2">
                  <SelectField
                    index={5}
                    label="Most-used platform"
                    value={
                      form.most_used_platform
                    }
                    onChange={set(
                      "most_used_platform"
                    )}
                    options={
                      PLATFORMS
                    }
                  />

                  <SelectField
                    index={6}
                    label="Main purpose of use"
                    value={
                      form.purpose_of_use
                    }
                    onChange={set(
                      "purpose_of_use"
                    )}
                    options={PURPOSES}
                  />

                  <SliderField
                    index={7}
                    label="Average daily usage"
                    value={
                      form.avg_daily_usage_hours
                    }
                    onChange={set(
                      "avg_daily_usage_hours"
                    )}
                    min={0}
                    max={16}
                    step={0.5}
                    unit="h"
                  />

                  <StepperField
                    index={8}
                    label="Daily phone unlocks"
                    value={
                      form.daily_unlocks
                    }
                    min={0}
                    onChange={set(
                      "daily_unlocks"
                    )}
                  />
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">
                  Lifestyle
                </h2>

                <div className="grid-2">
                  <SliderField
                    index={9}
                    label="Study hours"
                    value={
                      form.study_hours
                    }
                    onChange={set(
                      "study_hours"
                    )}
                    min={0}
                    max={16}
                    step={0.5}
                    unit="h"
                  />

                  <SliderField
                    index={10}
                    label="Physical activity"
                    value={
                      form.physical_activity_hours
                    }
                    onChange={set(
                      "physical_activity_hours"
                    )}
                    min={0}
                    max={10}
                    step={0.5}
                    unit="h"
                  />

                  <SliderField
                    index={11}
                    label="Sleep per night"
                    value={
                      form.sleep_hours_per_night
                    }
                    onChange={set(
                      "sleep_hours_per_night"
                    )}
                    min={0}
                    max={14}
                    step={0.5}
                    unit="h"
                  />
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">
                  Stress
                </h2>

                <div className="grid-2">
                  <SelectField
                    index={12}
                    label="Typical stress level"
                    value={
                      form.stress_level
                    }
                    onChange={set(
                      "stress_level"
                    )}
                    options={
                      STRESS_LEVELS
                    }
                    hint={
                      STRESS_HINT[
                        form.stress_level
                      ]
                    }
                  />
                </div>

                <div className="submit-row">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                      status === "loading"
                    }
                  >
                    {status ===
                    "loading" ? (
                      <>
                        <span className="loading-dot" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SparkleIcon />
                        Predict my score
                      </>
                    )}
                  </button>

                  {status === "error" && (
                    <span className="error-msg">
                      {errorMsg}
                      {" — "}
                      Check that the
                      FastAPI server is
                      running and the
                      endpoint is correct.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`result-panel ${
                result != null
                  ? "has-result"
                  : ""
              }`}
              ref={resultRef}
            >
              <div className="result-header">
                <div className="result-icon">
                  <ActivityIcon />
                </div>

                <div>
                  <p className="result-eyebrow">
                    PERSONAL INSIGHT
                  </p>

                  <h3 className="result-title">
                    Your wellbeing snapshot
                  </h3>
                </div>
              </div>

              <div className="score-area">
                <Gauge score={result} />

                {result != null ? (
                  <>
                    <div
                      key={result}
                      className="score-number animate"
                    >
                      {result.toFixed(2)}

                      <span className="of10">
                        {" "}
                        / 10
                      </span>
                    </div>

                    <div className="score-badge">
                      <span className="badge-dot" />
                      {resultLabel}
                    </div>

                    <p className="score-descriptor">
                      {descriptor}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="score-number">
                      —

                      <span className="of10">
                        {" "}
                        / 10
                      </span>
                    </div>

                    <p className="score-descriptor">
                      Your result will appear here
                    </p>
                  </>
                )}
              </div>

              {result != null ? (
                <div className="insight-content">
                  <div className="insight-intro">
                    <div className="intro-icon">
                      <SparkleIcon />
                    </div>

                    <div>
                      <h4>
                        What does your score suggest?
                      </h4>

                      <p>
                        {result <= 3
                          ? "Your estimated wellbeing score is on the lower side. Your daily habits may have some areas worth paying closer attention to."
                          : result <= 6
                          ? "Your estimated wellbeing sits around the middle of the scale. There may be a healthy balance in some areas, while others could still improve."
                          : "Your estimated wellbeing is on the higher side. Your current combination of habits appears relatively balanced according to the model."}
                      </p>
                    </div>
                  </div>

                  <div className="insight-grid">
                    <div className="insight-card">
                      <div className="insight-card-top">
                        <span className="insight-card-icon">
                          ◷
                        </span>

                        <span className="insight-card-label">
                          SCREEN TIME
                        </span>
                      </div>

                      <strong>
                        {
                          form.avg_daily_usage_hours
                        }
                        h
                      </strong>

                      <p>
                        average daily usage
                      </p>

                      <div className="mini-progress">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              (form.avg_daily_usage_hours /
                                16) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="insight-card">
                      <div className="insight-card-top">
                        <span className="insight-card-icon">
                          ☾
                        </span>

                        <span className="insight-card-label">
                          SLEEP
                        </span>
                      </div>

                      <strong>
                        {
                          form.sleep_hours_per_night
                        }
                        h
                      </strong>

                      <p>
                        sleep per night
                      </p>

                      <div className="mini-progress">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              (form.sleep_hours_per_night /
                                10) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="insight-card">
                      <div className="insight-card-top">
                        <span className="insight-card-icon">
                          ◉
                        </span>

                        <span className="insight-card-label">
                          ACTIVITY
                        </span>
                      </div>

                      <strong>
                        {
                          form.physical_activity_hours
                        }
                        h
                      </strong>

                      <p>
                        physical activity
                      </p>

                      <div className="mini-progress">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              (form.physical_activity_hours /
                                5) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="insight-card">
                      <div className="insight-card-top">
                        <span className="insight-card-icon">
                          ~
                        </span>

                        <span className="insight-card-label">
                          STRESS
                        </span>
                      </div>

                      <strong>
                        {form.stress_level}
                      </strong>

                      <p>
                        typical stress level
                      </p>

                      <div className="stress-indicator">
                        <span
                          className={
                            form.stress_level ===
                            "Very High"
                              ? "active danger"
                              : "active"
                          }
                        />

                        <span
                          className={
                            form.stress_level ===
                              "High" ||
                            form.stress_level ===
                              "Very High"
                              ? "active"
                              : ""
                          }
                        />

                        <span
                          className={
                            form.stress_level ===
                              "Medium" ||
                            form.stress_level ===
                              "High" ||
                            form.stress_level ===
                              "Very High"
                              ? "active"
                              : ""
                          }
                        />

                        <span
                          className={
                            form.stress_level ===
                            "Low"
                              ? "active"
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="model-observation">
                    <div className="observation-heading">
                      <span>
                        MODEL OBSERVATION
                      </span>

                      <span className="observation-line" />
                    </div>

                    <p>
                      Based on the information
                      you provided, the model
                      considers your combination
                      of{" "}
                      <b>
                        screen habits,
                        lifestyle, study pattern
                        and stress
                      </b>{" "}
                      when estimating your score.
                    </p>
                  </div>

                  <div className="action-card">
                    <div className="action-icon">
                      ✦
                    </div>

                    <div>
                      <h4>
                        A small reflection
                      </h4>

                      <p>
                        {result <= 3
                          ? "Consider which daily habit feels easiest to improve first. Small, consistent changes can be more realistic than changing everything at once."
                          : result <= 6
                          ? "Look for one area where you could create a little more balance — perhaps screen time, sleep, activity or stress management."
                          : "Keep noticing which habits help you feel balanced. Maintaining good sleep, activity and intentional screen use can support that balance."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-insight">
                  <div className="empty-orbit">
                    <div className="orbit-ring ring-one" />
                    <div className="orbit-ring ring-two" />

                    <div className="orbit-center">
                      <SparkleIcon />
                    </div>
                  </div>

                  <h3>
                    Your personal insight
                  </h3>

                  <p>
                    Complete the questions on the
                    left and we'll turn your answers
                    into a simple wellbeing snapshot.
                  </p>

                  <div className="empty-points">
                    <div>
                      <span>01</span>
                      Lifestyle signals
                    </div>

                    <div>
                      <span>02</span>
                      Digital habits
                    </div>

                    <div>
                      <span>03</span>
                      Stress patterns
                    </div>
                  </div>
                </div>
              )}

              <div className="disclaimer">
                This is a statistical estimate based
                on survey data, not a clinical
                assessment or diagnosis. Use the
                result as a reflection tool rather
                than a medical conclusion.
              </div>
            </div>
          </div>
        </form>

        <footer className="foot">
          <span className="footer-dot" />
          MindMetric
          <span>•</span>
          FastAPI
          <span>•</span>
          Machine Learning
          <span>•</span>
          POST /predict
        </footer>
      </div>
    </div>
  );
}