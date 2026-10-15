import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BottomBar from '../components/layout/BottomBar';

describe('BottomBar Component', () => {
  it('renders bottom bar controls', () => {
    render(
      <BottomBar
        drawTool="select"
        setDrawTool={() => {}}
        drawColor="#ffffff"
        setDrawColor={() => {}}
        clearDrawings={() => {}}
        undoDrawing={() => {}}
        isHoldingReset={false}
        startHoldReset={() => {}}
        cancelHoldReset={() => {}}
        resetHoldProgress={0}
      />
    );

    expect(screen.getByTitle(/Coret Bebas/i)).toBeInTheDocument();
  });
});
