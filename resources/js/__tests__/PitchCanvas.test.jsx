import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PitchCanvas from '../components/pitch/PitchCanvas';

describe('PitchCanvas Component', () => {
  it('renders without crashing', () => {
    const mcRef = { current: document.createElement('canvas') };
    const drawcRef = { current: document.createElement('canvas') };
    const trashRef = { current: document.createElement('div') };

    const { container } = render(
      <PitchCanvas
        zoom={1}
        mcRef={mcRef}
        drawcRef={drawcRef}
        trashRef={trashRef}
        drawTool="select"
        isLandscape={false}
        getPointerCoords={() => ({ x: 0, y: 0 })}
        onDown={() => {}}
        onMove={() => {}}
        onUp={() => {}}
        onDrawStart={() => {}}
        onDrawMove={() => {}}
        onDrawEnd={() => {}}
        curFId="433"
        phase={null}
        triggerPhase={() => {}}
        simSpd={1}
        setSimSpd={() => {}}
        overlays={{ zone: true, pass: false }}
        setOverlays={() => {}}
        setZoom={() => {}}
        roster={[]}
        addPlayer={() => {}}
        addPlayers={() => {}}
        updatePlayer={() => {}}
        deletePlayer={() => {}}
        scenario={{ layers: [], currentLayerIndex: 0 }}
        setIsBrowserOpen={() => {}}
        setIsSaveOpen={() => {}}
        setIsLoadOpen={() => {}}
        renderPitch={() => {}}
        redrawDrawings={() => {}}
      />
    );

    expect(container.querySelector('.main')).toBeInTheDocument();
  });
});
