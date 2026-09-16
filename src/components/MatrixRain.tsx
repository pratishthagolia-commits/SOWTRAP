"use client";

import { useEffect, useRef } from "react";
import { INGREDIENT_NAMES } from "@/data/ingredients";

const RAIN_COLORS = ["0, 198, 224", "255, 201, 122"]; // #00C6E0 cyan, #FFC97A saffron
const CELL_SIZE = 24; // vertical spacing between stacked letters
const FONT = `700 19px "Courier New", monospace`;
const COLUMN_WIDTH = 34;
const GAP_ROWS = 2; // blank rows between one word and the next

function randomWord() {
  return INGREDIENT_NAMES[Math.floor(Math.random() * INGREDIENT_NAMES.length)];
}

// builds a looping sequence of rows (one letter per row, blanks for spaces
// and the gap between words) long enough to fill the column, by chaining
// whole ingredient names spelled top-to-bottom
function buildColumnSequence(minLength: number): (string | null)[] {
  const rows: (string | null)[] = [];
  while (rows.length < minLength) {
    const word = randomWord().toUpperCase();
    for (const ch of word) rows.push(ch === " " ? null : ch);
    for (let g = 0; g < GAP_ROWS; g++) rows.push(null);
  }
  // the row/index relationship in draw() runs in reverse (see comment there),
  // so the sequence has to be built backwards for it to read top-to-bottom correctly
  return rows.reverse();
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let heads: number[] = [];
    let speeds: number[] = [];
    let sequences: (string | null)[][] = [];
    // each column sits at its own "depth" — bright/glowing columns read as
    // foreground, dim ones recede into the background, which is what gives
    // real matrix rain its layered look instead of a flat wall of text
    let brightness: number[] = [];
    let glow: boolean[] = [];
    let colColor: string[] = [];

    let frameId = 0;

    function resize() {
      const newWidth = hero!.clientWidth;
      const newHeight = hero!.clientHeight;
      // mobile browsers change innerHeight (and so .hero's own height,
      // since it's sized off viewport units) as their toolbar collapses
      // and expands while scrolling, firing this on every scroll tick.
      // Rebuilding every column's random letters/speed/colour each time
      // read as the rain glitching/restarting mid-scroll — only a width
      // change actually needs the column layout rebuilt; a height-only
      // change just needs the canvas element resized to match.
      const widthChanged = newWidth !== width;
      if (!widthChanged && newHeight === height) return;
      width = canvas!.width = newWidth;
      height = canvas!.height = newHeight;
      if (!widthChanged) return;
      cols = Math.ceil(width / COLUMN_WIDTH);
      const visibleRows = Math.ceil(height / CELL_SIZE);

      heads = new Array(cols).fill(0).map(() => Math.random() * visibleRows);
      // moderate — visibly moving, but still slow enough to read a word
      speeds = new Array(cols).fill(0).map(() => 0.045 + Math.random() * 0.03);
      sequences = new Array(cols).fill(0).map(() => buildColumnSequence(visibleRows + 4));
      brightness = new Array(cols).fill(0).map(() => {
        // skew toward dim: most columns are background, a minority pop forward
        const r = Math.random();
        if (r < 0.55) return 0.22 + Math.random() * 0.18; // faint background
        if (r < 0.85) return 0.45 + Math.random() * 0.25; // mid-ground
        return 0.85 + Math.random() * 0.15; // bright foreground
      });
      glow = brightness.map((b) => b > 0.8);
      colColor = new Array(cols).fill(0).map(
        () => RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)]
      );
      ctx!.clearRect(0, 0, width, height);
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.font = FONT;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (let c = 0; c < cols; c++) {
        const x = c * COLUMN_WIDTH + COLUMN_WIDTH / 2;
        const seq = sequences[c];
        const totalRows = seq.length;
        const b = brightness[c];

        heads[c] += speeds[c];

        const color = colColor[c];
        if (glow[c]) {
          ctx!.shadowColor = `rgb(${color})`;
          ctx!.shadowBlur = 8;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.fillStyle = `rgba(${color}, ${b})`;

        for (let i = 0; i < totalRows; i++) {
          // screen row decreases as i increases (see buildColumnSequence),
          // so sequence index i=0 lands at the bottom of the pattern, not the top
          const rawRow = heads[c] - i;
          const wrappedRow = ((rawRow % totalRows) + totalRows) % totalRows;
          const y = wrappedRow * CELL_SIZE;
          if (y > height + CELL_SIZE) continue;

          const ch = seq[i];
          if (ch) ctx!.fillText(ch, x, y);
        }
      }

      frameId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas id="rainCanvas" ref={canvasRef} />;
}
