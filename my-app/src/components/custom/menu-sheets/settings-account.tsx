interface SettingsAccountProps {
  onClose: () => void
}

export default function SettingsAccount({ onClose }: SettingsAccountProps) {
  return (
    <div></div>
    // {profile.type === "investor" && (
    //   <div>
    //     <p className="text-sm text-muted-foreground mb-4">
    //       When your profile is set to 'Active', founders can send you invite notifications to view their
    //       startups.
    //     </p>
    //     <div className="flex justify-between items-center">
    //       <div className="flex items-center space-x-2">
    //         <Checkbox
    //           id="investor_active"
    //           checked={name.investor_active || false}
    //           onCheckedChange={handleCheckboxChange}
    //         />
    //         <Label
    //           htmlFor="investor_active"
    //           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //         >
    //           Active
    //         </Label>
    //       </div>
    //     </div>
    //   </div>
    // )}
  )
}