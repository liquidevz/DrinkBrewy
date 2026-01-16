import numpy as np
from core.binn import BINN
from core.current_model import CurrentInput
import matplotlib.pyplot as plt

def run_current_demo():
    print("Initializing BINN with Electronic Current Model...")
    model = BINN(input_dim=10, hidden_dim=20, output_dim=5)
    current_interface = CurrentInput(resistance=1000.0) # 1k Ohm resistance
    
    steps = 300
    dopamine_history = []
    current_history = []
    
    print(f"Running simulation for {steps} steps...")
    
    for t in range(steps):
        input_spikes = (np.random.rand(10) > 0.8).astype(float)
        
        current_inputs = {}
        # Simulate a 5V pulse for 50 steps starting at t=50
        if 50 <= t < 100:
            # I = V / R = 5 / 1000 = 0.005 Amperes (5mA)
            amps = current_interface.inject_current(voltage=5.0, duration_ms=1.0)
            current_inputs = {"excitement": amps, "happy": amps * 0.5}
        
        # Simulate a negative 2V pulse at t=200
        if 200 <= t < 230:
            amps = current_interface.inject_current(voltage=2.0, duration_ms=1.0)
            current_inputs = {"sad": amps}
            
        result = model.step(input_spikes, current_inputs)
        
        dopamine_history.append(result["dopamine_level"])
        # Track excitement current for plotting
        current_history.append(current_inputs.get("excitement", 0.0) * 1000) # mA
        
    print("Simulation complete.")
    
    plt.figure(figsize=(12, 8))
    
    plt.subplot(3, 1, 1)
    plt.plot(current_history, color='red', label='Input Current (mA)')
    plt.title("Electronic Current Input (Value Spikes)")
    plt.ylabel("mA")
    plt.legend()
    
    plt.subplot(3, 1, 2)
    plt.plot(dopamine_history, color='gold', label='Dopamine Level')
    plt.title("Dopamine Modulation")
    plt.ylabel("Level")
    plt.legend()
    
    plt.subplot(3, 1, 3)
    # Plotting one of the emotion states
    plt.plot([0]*steps, label='Placeholder') # Just to keep structure
    plt.title("System Response")
    plt.xlabel("Time Steps")
    
    plt.tight_layout()
    plt.savefig("binn_current_results.png")
    print("Results saved to binn_current_results.png")

if __name__ == "__main__":
    run_current_demo()
