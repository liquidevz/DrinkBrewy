import numpy as np
from core.binn import BINN
import matplotlib.pyplot as plt

def run_demo():
    print("Initializing BINN...")
    # 10 input neurons, 20 hidden, 5 output
    model = BINN(input_dim=10, hidden_dim=20, output_dim=5)
    
    steps = 200
    dopamine_history = []
    output_activity = []
    
    print(f"Running simulation for {steps} steps...")
    
    for t in range(steps):
        # Generate random input spikes
        input_spikes = (np.random.rand(10) > 0.8).astype(float)
        
        # Introduce a 'Value Spike' (reward) at step 50
        value_spike = None
        if t == 50:
            print(">>> Triggering Value Spike: Excitement +0.5")
            value_spike = {"excitement": 0.5, "happy": 0.3}
        
        # Introduce a negative spike at step 120
        if t == 120:
            print(">>> Triggering Value Spike: Sad +0.4")
            value_spike = {"sad": 0.4, "happy": -0.3}
            
        result = model.step(input_spikes, value_spike)
        
        dopamine_history.append(result["dopamine_level"])
        output_activity.append(np.sum(result["output_spikes"]))
        
    print("Simulation complete.")
    
    # Plotting results
    plt.figure(figsize=(12, 6))
    
    plt.subplot(2, 1, 1)
    plt.plot(dopamine_history, color='gold', label='Dopamine Level')
    plt.title("Dopamine Modulation Over Time")
    plt.ylabel("Level")
    plt.legend()
    
    plt.subplot(2, 1, 2)
    plt.plot(output_activity, color='blue', label='Output Spikes')
    plt.title("Network Activity (Total Spikes)")
    plt.xlabel("Time Steps")
    plt.ylabel("Spike Count")
    plt.legend()
    
    plt.tight_layout()
    plt.savefig("binn_demo_results.png")
    print("Results saved to binn_demo_results.png")

if __name__ == "__main__":
    run_demo()
