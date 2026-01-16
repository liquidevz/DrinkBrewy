import numpy as np

class CurrentInput:
    """
    Models external 'Value Spikes' as real electronic current inputs (Amperes/Volts).
    This translates physical electrical signals into biological modulation.
    """
    def __init__(self, resistance=1000.0, capacitance=1e-6):
        # Physical properties of the input interface
        self.resistance = resistance  # Ohms
        self.capacitance = capacitance # Farads
        self.current_buffer = 0.0      # Amperes
        
    def inject_current(self, voltage, duration_ms, dt=1.0):
        """
        Simulates a voltage pulse being converted to current.
        I = V / R
        """
        injected_i = voltage / self.resistance
        return injected_i

    def calculate_charge(self, current, dt_ms):
        """
        Q = I * t
        Translates current over time into a 'charge' that affects the system.
        """
        dt_s = dt_ms / 1000.0
        return current * dt_s

class ElectronicValueSpike:
    """
    Translates raw electrical current into emotional/dopaminergic shifts.
    """
    def __init__(self):
        # Mapping specific current ranges or frequencies to emotional categories
        # e.g., High frequency/intensity -> Excitement
        # e.g., Sustained low current -> Sad/Depletion
        pass

    @staticmethod
    def current_to_emotion_delta(current_amps, category):
        """
        Maps current intensity to a delta in the emotion wheel.
        Higher current = stronger spike.
        """
        # Sensitivity factor: how much 1mA affects the system
        sensitivity = 100.0 
        delta = current_amps * sensitivity
        
        # Directional mapping
        if category in ["sad", "angry"]:
            return -delta # Negative current/effect
        return delta
