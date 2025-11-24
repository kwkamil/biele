<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GalleryResource\Pages;
use App\Models\Gallery;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class GalleryResource extends Resource
{
    protected static ?string $model = Gallery::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';

    protected static ?string $navigationLabel = 'Galerie';

    protected static ?string $modelLabel = 'galeria';

    protected static ?string $pluralModelLabel = 'galerie';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull()
                    ->rows(3),
                Forms\Components\Toggle::make('is_approved')
                    ->label('Zatwierdzona'),
                Forms\Components\DateTimePicker::make('approved_at')
                    ->label('Data zatwierdzenia'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nazwa')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Użytkownik')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_approved')
                    ->label('Zatwierdzona')
                    ->boolean(),
                Tables\Columns\TextColumn::make('approved_at')
                    ->label('Data zatwierdzenia')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('artworks_count')
                    ->label('Liczba dzieł')
                    ->counts('artworks'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Utworzono')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('is_approved')
                    ->boolean(),
                Tables\Columns\TextColumn::make('approved_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_approved')
                    ->label('Status zatwierdzenia')
                    ->boolean()
                    ->trueLabel('Zatwierdzone')
                    ->falseLabel('Oczekujące')
                    ->native(false),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Zatwierdź')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Gallery $record) => ! $record->is_approved)
                    ->requiresConfirmation()
                    ->action(function (Gallery $record) {
                        $record->update([
                            'is_approved' => true,
                            'approved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Galeria została zatwierdzona')
                            ->success()
                            ->send();
                    }),
                Action::make('reject')
                    ->label('Odrzuć')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Gallery $record) => $record->is_approved)
                    ->requiresConfirmation()
                    ->action(function (Gallery $record) {
                        $record->update([
                            'is_approved' => false,
                            'approved_at' => null,
                        ]);

                        Notification::make()
                            ->title('Galeria została odrzucona')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve')
                        ->label('Zatwierdź wybrane')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each(function (Gallery $record) {
                                $record->update([
                                    'is_approved' => true,
                                    'approved_at' => now(),
                                ]);
                            });

                            Notification::make()
                                ->title('Galerie zostały zatwierdzone')
                                ->success()
                                ->send();
                        }),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->withCount('artworks');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListGalleries::route('/'),
            'create' => Pages\CreateGallery::route('/create'),
            'edit' => Pages\EditGallery::route('/{record}/edit'),
        ];
    }
}
